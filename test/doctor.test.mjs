import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildMintInvocation,
  compareVersions,
  findDocsRoot,
  formatCheck,
  isNodeSupported,
  resolveTelemetry,
} from "../scripts/doctor.mjs";
import { patchMintlifyPreviewingTarImport } from "../scripts/patch-mintlify-previewing-tar.mjs";

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
