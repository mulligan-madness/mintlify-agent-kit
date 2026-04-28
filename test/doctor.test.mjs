import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDeployReadinessChecks,
  buildMintInvocation,
  compareVersions,
  findDocsRoot,
  formatCheck,
  isNodeSupported,
  resolveTelemetry,
} from "../scripts/doctor.mjs";
import {
  patchJsYamlCompatibilityAliases,
  patchMintlifyPreviewingTarImport,
} from "../scripts/patch-mintlify-previewing-tar.mjs";

const JS_YAML_UNPATCHED_ALIASES = `// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');`;

const JS_YAML_PATCHED_ALIASES = `// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = module.exports.load;
module.exports.safeLoadAll         = module.exports.loadAll;
module.exports.safeDump            = module.exports.dump;`;

test("compareVersions orders semantic version components numerically", () => {
  assert.equal(compareVersions("20.17.0", "20.17.0"), 0);
  assert.equal(compareVersions("20.17.1", "20.17.0"), 1);
  assert.equal(compareVersions("21.0.0", "20.17.0"), 1);
  assert.equal(compareVersions("20.16.9", "20.17.0"), -1);
});

test("isNodeSupported enforces Mintlify's Node 20.17.0 minimum", () => {
  assert.equal(isNodeSupported("v20.16.9"), false);
  assert.equal(isNodeSupported("v20.17.0"), true);
  assert.equal(isNodeSupported("v23.7.0"), true);
});

test("findDocsRoot walks up from nested directories to docs.json", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-docs-"));
  try {
    const nested = path.join(root, "docs", "guides", "deep");
    await mkdir(nested, { recursive: true });
    await writeFile(path.join(root, "docs", "docs.json"), "{}\n");

    assert.equal(await findDocsRoot(nested), path.join(root, "docs"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("findDocsRoot returns null when no docs.json is present", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-no-docs-"));
  try {
    assert.equal(await findDocsRoot(root), null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("resolveTelemetry disables automated mint checks by default", () => {
  const telemetry = resolveTelemetry({});

  assert.equal(telemetry.enabled, false);
  assert.equal(telemetry.env.DO_NOT_TRACK, "1");
  assert.equal(telemetry.env.MINTLIFY_TELEMETRY_DISABLED, "1");
});

test("resolveTelemetry allows explicit opt-in", () => {
  const telemetry = resolveTelemetry({ MINTLIFY_AGENT_KIT_ENABLE_TELEMETRY: "1" });

  assert.equal(telemetry.enabled, true);
  assert.deepEqual(telemetry.env, {});
});

test("buildMintInvocation uses the repo-local official mint binary contract", () => {
  const invocation = buildMintInvocation("/kit/home", ["validate"]);

  assert.deepEqual(invocation.command, "npm");
  assert.deepEqual(invocation.args, ["--prefix", "/kit/home", "exec", "--", "mint", "validate"]);
});

test("buildDeployReadinessChecks reports optional deploy env without failing", () => {
  assert.deepEqual(buildDeployReadinessChecks({}), [
    {
      label: "deploy api key",
      ok: null,
      detail: "optional MINTLIFY_ADMIN_API_KEY missing; required only for preview deployment API commands",
    },
    {
      label: "deploy project id",
      ok: null,
      detail: "optional MINTLIFY_PROJECT_ID missing; pass --project-id for multi-project preview deployment work",
    },
  ]);

  assert.deepEqual(buildDeployReadinessChecks({
    MINTLIFY_ADMIN_API_KEY: "mint_secret",
    MINTLIFY_PROJECT_ID: "project_123",
  }), [
    {
      label: "deploy api key",
      ok: null,
      detail: "available from environment or kit .env",
    },
    {
      label: "deploy project id",
      ok: null,
      detail: "available from environment or kit .env",
    },
  ]);
});

test("formatCheck keeps success, warning, and failure output stable", () => {
  assert.equal(formatCheck("ok", true, "ready"), "[ok] ok: ready");
  assert.equal(formatCheck("warn", null, "blocked"), "[warn] warn: blocked");
  assert.equal(formatCheck("bad", false, "missing"), "[fail] bad: missing");
});

test("patchMintlifyPreviewingTarImport rewrites the incompatible tar default import", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-patch-"));
  try {
    const target = path.join(root, "client.js");
    await writeFile(target, "import tar from 'tar';\nconsole.log(tar);\n");

    assert.deepEqual(patchMintlifyPreviewingTarImport(target), {
      changed: true,
      reason: "patched",
    });

    const contents = await readFile(target, "utf8");
    assert.equal(contents, "import * as tar from 'tar';\nconsole.log(tar);\n");
    assert.deepEqual(patchMintlifyPreviewingTarImport(target), {
      changed: false,
      reason: "already-patched",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("patchJsYamlCompatibilityAliases rewrites removed compatibility aliases", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-js-yaml-patch-"));
  try {
    const target = path.join(root, "index.js");
    await writeFile(target, `'use strict';\n\n${JS_YAML_UNPATCHED_ALIASES}\n`);

    assert.deepEqual(patchJsYamlCompatibilityAliases(target), {
      changed: true,
      reason: "patched",
    });

    const contents = await readFile(target, "utf8");
    assert.equal(contents, `'use strict';\n\n${JS_YAML_PATCHED_ALIASES}\n`);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("patchJsYamlCompatibilityAliases is idempotent when aliases are already patched", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-js-yaml-idempotent-"));
  try {
    const target = path.join(root, "index.js");
    await writeFile(target, `'use strict';\n\n${JS_YAML_PATCHED_ALIASES}\n`);

    assert.deepEqual(patchJsYamlCompatibilityAliases(target), {
      changed: false,
      reason: "already-patched",
    });

    const contents = await readFile(target, "utf8");
    assert.equal(contents, `'use strict';\n\n${JS_YAML_PATCHED_ALIASES}\n`);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("patchJsYamlCompatibilityAliases reports a missing target", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-js-yaml-missing-"));
  try {
    assert.deepEqual(patchJsYamlCompatibilityAliases(path.join(root, "missing.js")), {
      changed: false,
      reason: "target-missing",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("patchJsYamlCompatibilityAliases reports an expected alias mismatch", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-js-yaml-mismatch-"));
  try {
    const target = path.join(root, "index.js");
    await writeFile(target, JS_YAML_UNPATCHED_ALIASES.replace("safeDump", "unsafeDump"));

    assert.deepEqual(patchJsYamlCompatibilityAliases(target), {
      changed: false,
      reason: "expected-aliases-missing",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
