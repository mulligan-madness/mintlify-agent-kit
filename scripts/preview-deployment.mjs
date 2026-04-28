#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const API_BASE_URL = "https://api.mintlify.com/v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_KIT_HOME = path.resolve(__dirname, "..");

export function loadDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const values = {};
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ") ? line.slice("export ".length).trim() : line;
    const separator = normalized.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = normalized.slice(0, separator).trim();
    const rawValue = normalized.slice(separator + 1).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }
    values[key] = unquote(rawValue);
  }

  return values;
}

export function loadKitEnv({ env = process.env, kitHome = DEFAULT_KIT_HOME } = {}) {
  return {
    ...loadDotEnv(path.join(kitHome, ".env")),
    ...env,
  };
}

export function resolveProjectId(options, env) {
  return options.projectId || env.MINTLIFY_PROJECT_ID;
}

export function parseArgs(argv) {
  const options = {
    command: null,
    branch: null,
    projectId: null,
    statusId: null,
    help: false,
  };

  const args = [...argv];
  if (args[0] && !args[0].startsWith("-")) {
    options.command = args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case "--branch":
        options.branch = readFlagValue(args, ++index, "--branch");
        break;
      case "--project-id":
        options.projectId = readFlagValue(args, ++index, "--project-id");
        break;
      case "--status-id":
        options.statusId = readFlagValue(args, ++index, "--status-id");
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

function readFlagValue(args, index, flag) {
  const value = args[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

export function resolveCurrentBranch(cwd = process.cwd()) {
  const branch = execFileSync("git", ["branch", "--show-current"], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  if (!branch) {
    throw new Error("Could not infer the current Git branch; pass --branch <branch>.");
  }

  return branch;
}

export async function triggerPreviewDeployment({
  apiKey,
  projectId,
  branch,
  cwd = process.cwd(),
  fetchImpl = globalThis.fetch,
} = {}) {
  const resolvedBranch = branch || resolveCurrentBranch(cwd);
  requireValue(apiKey, "MINTLIFY_ADMIN_API_KEY is required to trigger a preview deployment.");
  requireValue(projectId, "MINTLIFY_PROJECT_ID or --project-id is required to trigger a preview deployment.");
  requireValue(resolvedBranch, "--branch is required when the current Git branch cannot be inferred.");

  const response = await requestJson(
    `${API_BASE_URL}/project/preview/${encodeURIComponent(projectId)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ branch: resolvedBranch }),
    },
    fetchImpl,
    [apiKey],
  );

  return {
    projectId,
    branch: resolvedBranch,
    statusId: response.statusId,
    previewUrl: response.previewUrl,
  };
}

export async function getDeploymentStatus({
  apiKey,
  statusId,
  fetchImpl = globalThis.fetch,
} = {}) {
  requireValue(apiKey, "MINTLIFY_ADMIN_API_KEY is required to check deployment status.");
  requireValue(statusId, "--status-id is required to check deployment status.");

  return requestJson(
    `${API_BASE_URL}/project/update-status/${encodeURIComponent(statusId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
    fetchImpl,
    [apiKey],
  );
}

export function formatPreviewResult(result, secrets = []) {
  return [
    "Preview deployment queued",
    `projectId: ${redactSecrets(result.projectId, secrets)}`,
    `branch: ${redactSecrets(result.branch, secrets)}`,
    `statusId: ${redactSecrets(result.statusId ?? "", secrets)}`,
    `previewUrl: ${redactSecrets(result.previewUrl ?? "", secrets)}`,
  ].join("\n");
}

export function formatStatusResult(status, secrets = []) {
  const lines = [
    "Deployment status",
    `statusId: ${redactSecrets(status._id ?? "", secrets)}`,
    `projectId: ${redactSecrets(status.projectId ?? "", secrets)}`,
    `status: ${redactSecrets(status.status ?? "", secrets)}`,
  ];

  addLine(lines, "summary", status.summary, secrets);
  addLine(lines, "createdAt", status.createdAt, secrets);
  addLine(lines, "endedAt", status.endedAt, secrets);
  addLine(lines, "subdomain", status.subdomain, secrets);
  addLine(lines, "source", status.source, secrets);
  addLine(lines, "commitRef", status.commit?.ref, secrets);
  addLine(lines, "commitSha", status.commit?.sha, secrets);

  if (Array.isArray(status.logs) && status.logs.length > 0) {
    lines.push("logs:");
    for (const log of status.logs.slice(-10)) {
      lines.push(`- ${redactSecrets(String(log), secrets)}`);
    }
  }

  return lines.join("\n");
}

export function redactSecrets(value, secrets = []) {
  let redacted = String(value);
  for (const secret of secrets) {
    if (secret) {
      redacted = redacted.split(String(secret)).join("[REDACTED]");
    }
  }

  return redacted
    .replace(/Bearer\s+mint_[A-Za-z0-9._/-]+/g, "Bearer [REDACTED]")
    .replace(/mint_[A-Za-z0-9._/-]+/g, "[REDACTED]");
}

function unquote(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function requireValue(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

async function requestJson(url, options, fetchImpl, secrets = []) {
  if (typeof fetchImpl !== "function") {
    throw new Error("This command requires a Node.js runtime with fetch support.");
  }

  const response = await fetchImpl(url, options);
  const bodyText = await response.text();
  const body = bodyText ? parseJson(bodyText, secrets) : {};

  if (!response.ok) {
    throw new Error(`Mintlify API request failed (${response.status}): ${redactSecrets(bodyText || response.statusText, secrets)}`);
  }

  return body;
}

function parseJson(value, secrets = []) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Mintlify API returned invalid JSON: ${redactSecrets(value, secrets)}`);
  }
}

function addLine(lines, label, value, secrets = []) {
  if (value !== undefined && value !== null && value !== "") {
    lines.push(`${label}: ${redactSecrets(String(value), secrets)}`);
  }
}

function usage() {
  return `Usage:
  npm run preview:trigger -- [--branch <branch>] [--project-id <projectId>]
  npm run preview:status -- --status-id <statusId>

Environment:
  MINTLIFY_ADMIN_API_KEY  Required when a preview/status command runs.
  MINTLIFY_PROJECT_ID     Default project ID for preview:trigger.

The kit-local .env file is loaded when present. Exported shell variables
override .env values, and --project-id overrides MINTLIFY_PROJECT_ID.`;
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help || !options.command) {
    console.log(usage());
    return 0;
  }

  const env = loadKitEnv();
  const apiKey = env.MINTLIFY_ADMIN_API_KEY;
  const projectId = resolveProjectId(options, env);

  if (options.command === "trigger") {
    const result = await triggerPreviewDeployment({
      apiKey,
      projectId,
      branch: options.branch,
    });
    console.log(formatPreviewResult(result, [apiKey]));
    return 0;
  }

  if (options.command === "status") {
    const status = await getDeploymentStatus({
      apiKey,
      statusId: options.statusId,
    });
    console.log(formatStatusResult(status, [apiKey]));
    return 0;
  }

  throw new Error(`Unknown command: ${options.command}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      console.error(redactSecrets(error.message, [process.env.MINTLIFY_ADMIN_API_KEY]));
      process.exitCode = 1;
    });
}
