#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const MIN_NODE_VERSION = "20.17.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_KIT_HOME = path.resolve(__dirname, "..");

export function compareVersions(actual, expected) {
  const actualParts = normalizeVersion(actual);
  const expectedParts = normalizeVersion(expected);
  const length = Math.max(actualParts.length, expectedParts.length);

  for (let index = 0; index < length; index += 1) {
    const left = actualParts[index] ?? 0;
    const right = expectedParts[index] ?? 0;
    if (left > right) return 1;
    if (left < right) return -1;
  }

  return 0;
}

export function isNodeSupported(version) {
  return compareVersions(version, MIN_NODE_VERSION) >= 0;
}

export async function findDocsRoot(startDirectory = process.cwd()) {
  let current = path.resolve(startDirectory);

  while (true) {
    const candidate = path.join(current, "docs.json");
    if (await fileExists(candidate)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export function resolveTelemetry(env = process.env) {
  if (env.MINTLIFY_AGENT_KIT_ENABLE_TELEMETRY === "1") {
    return {
      enabled: true,
      summary: "enabled by MINTLIFY_AGENT_KIT_ENABLE_TELEMETRY=1",
      env: {},
    };
  }

  return {
    enabled: false,
    summary: "disabled for automated agent checks",
    env: {
      DO_NOT_TRACK: "1",
      MINTLIFY_TELEMETRY_DISABLED: "1",
    },
  };
}

export function buildMintInvocation(kitHome, mintArgs) {
  return {
    command: "npm",
    args: ["--prefix", kitHome, "exec", "--", "mint", ...mintArgs],
  };
}

export function formatCheck(label, ok, detail) {
  const status = ok === true ? "ok" : ok === false ? "fail" : "warn";
  return `[${status}] ${label}: ${detail}`;
}

function normalizeVersion(version) {
  return String(version)
    .trim()
    .replace(/^v/, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const options = {
    adapter: "local",
    docsRoot: null,
    checkStatus: false,
    checkSubdomain: false,
    validate: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case "--adapter":
        options.adapter = argv[++index] ?? "";
        break;
      case "--docs-root":
        options.docsRoot = argv[++index] ?? "";
        break;
      case "--status":
        options.checkStatus = true;
        break;
      case "--subdomain":
        options.checkSubdomain = true;
        break;
      case "--validate":
        options.validate = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function usage() {
  return `Usage:
  npm run doctor -- [--adapter codex|cursor|both|local] [--docs-root <path>] [--status] [--subdomain] [--validate]

The doctor reports local Mintlify Agent Kit state and invokes only official
mint commands through:

  npm --prefix "$MINTLIFY_AGENT_KIT_HOME" exec -- mint <command> ...
`;
}

function readPackageJson(kitHome) {
  const packagePath = path.join(kitHome, "package.json");
  if (!existsSync(packagePath)) {
    return null;
  }
  return JSON.parse(readFileSync(packagePath, "utf8"));
}

function commandOutput(command, args, options = {}) {
  try {
    return {
      ok: true,
      stdout: execFileSync(command, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        ...options,
      }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      stdout: String(error.stdout ?? "").trim(),
      stderr: String(error.stderr ?? "").trim(),
      message: error.message,
    };
  }
}

function resolveKitHome() {
  return path.resolve(process.env.MINTLIFY_AGENT_KIT_HOME || DEFAULT_KIT_HOME);
}

function resolvedMintPath(kitHome) {
  return path.join(kitHome, "node_modules", ".bin", process.platform === "win32" ? "mint.cmd" : "mint");
}

async function runDoctor(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return 0;
  }

  const kitHome = resolveKitHome();
  const packageJson = readPackageJson(kitHome);
  const telemetry = resolveTelemetry(process.env);
  const npmVersion = commandOutput("npm", ["--version"]);
  const mintPath = resolvedMintPath(kitHome);
  const mintVersion = commandOutput(
    "npm",
    ["--prefix", kitHome, "exec", "--", "mint", "--version"],
    { env: { ...process.env, ...telemetry.env } },
  );
  const docsRoot = options.docsRoot
    ? path.resolve(options.docsRoot)
    : await findDocsRoot(process.cwd());

  const checks = [];
  checks.push({
    label: "node",
    ok: isNodeSupported(process.version),
    detail: `${process.version} (requires >=${MIN_NODE_VERSION})`,
  });
  checks.push({
    label: "npm",
    ok: npmVersion.ok,
    detail: npmVersion.ok ? npmVersion.stdout : npmVersion.stderr || npmVersion.message,
  });
  checks.push({
    label: "kit home",
    ok: existsSync(kitHome),
    detail: kitHome,
  });
  checks.push({
    label: "mint package",
    ok: Boolean(packageJson?.dependencies?.mint),
    detail: packageJson?.dependencies?.mint
      ? `mint@${packageJson.dependencies.mint}`
      : "mint dependency missing from package.json",
  });
  checks.push({
    label: "mint executable",
    ok: existsSync(mintPath),
    detail: mintPath,
  });
  checks.push({
    label: "mint version",
    ok: mintVersion.ok,
    detail: mintVersion.ok ? mintVersion.stdout : mintVersion.stderr || mintVersion.message,
  });
  checks.push({
    label: "adapter",
    ok: null,
    detail: options.adapter,
  });
  checks.push({
    label: "telemetry",
    ok: null,
    detail: telemetry.summary,
  });
  checks.push({
    label: "docs root",
    ok: docsRoot ? true : null,
    detail: docsRoot || "not found from current directory; pass --docs-root <path> when needed",
  });

  if (options.checkStatus) {
    checks.push(runMintCheck(kitHome, ["status"], docsRoot, telemetry, "mint status"));
  }

  if (options.checkSubdomain) {
    checks.push(runMintCheck(kitHome, ["config", "get", "subdomain"], docsRoot, telemetry, "mint subdomain"));
  }

  if (options.validate) {
    if (docsRoot) {
      checks.push(runMintCheck(kitHome, ["validate"], docsRoot, telemetry, "mint validate"));
    } else {
      checks.push({
        label: "mint validate",
        ok: null,
        detail: "blocked because no docs root was found",
      });
    }
  }

  for (const check of checks) {
    console.log(formatCheck(check.label, check.ok, check.detail));
  }

  return checks.some((check) => check.ok === false) ? 1 : 0;
}

function runMintCheck(kitHome, mintArgs, docsRoot, telemetry, label) {
  const invocation = buildMintInvocation(kitHome, mintArgs);
  const result = commandOutput(invocation.command, invocation.args, {
    cwd: docsRoot || process.cwd(),
    env: { ...process.env, ...telemetry.env },
  });

  return {
    label,
    ok: result.ok,
    detail: result.ok ? firstLine(result.stdout) || "command completed" : firstLine(result.stderr || result.stdout || result.message),
  };
}

function firstLine(value) {
  return String(value ?? "").split(/\r?\n/).find(Boolean) ?? "";
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runDoctor()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
