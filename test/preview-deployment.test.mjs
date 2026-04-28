import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  formatPreviewResult,
  formatStatusResult,
  getDeploymentStatus,
  loadDotEnv,
  loadKitEnv,
  parseArgs,
  redactSecrets,
  resolveProjectId,
  triggerPreviewDeployment,
} from "../scripts/preview-deployment.mjs";

test("loadDotEnv parses simple env files without requiring dependencies", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-env-"));
  try {
    const envFile = path.join(root, ".env");
    await writeFile(envFile, [
      "# comment",
      "MINTLIFY_ADMIN_API_KEY='mint_file'",
      "export MINTLIFY_PROJECT_ID=project_file",
      "INVALID LINE",
      "",
    ].join("\n"));

    assert.deepEqual(loadDotEnv(envFile), {
      MINTLIFY_ADMIN_API_KEY: "mint_file",
      MINTLIFY_PROJECT_ID: "project_file",
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("loadKitEnv lets exported environment override kit .env", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-env-precedence-"));
  try {
    await writeFile(path.join(root, ".env"), [
      "MINTLIFY_ADMIN_API_KEY=mint_file",
      "MINTLIFY_PROJECT_ID=project_file",
    ].join("\n"));

    assert.deepEqual(
      {
        MINTLIFY_ADMIN_API_KEY: loadKitEnv({
          kitHome: root,
          env: { MINTLIFY_ADMIN_API_KEY: "mint_shell" },
        }).MINTLIFY_ADMIN_API_KEY,
        MINTLIFY_PROJECT_ID: loadKitEnv({
          kitHome: root,
          env: { MINTLIFY_ADMIN_API_KEY: "mint_shell" },
        }).MINTLIFY_PROJECT_ID,
      },
      {
        MINTLIFY_ADMIN_API_KEY: "mint_shell",
        MINTLIFY_PROJECT_ID: "project_file",
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("parseArgs supports project override for preview trigger", () => {
  assert.deepEqual(parseArgs(["trigger", "--branch", "docs-update", "--project-id", "project_123"]), {
    command: "trigger",
    branch: "docs-update",
    projectId: "project_123",
    statusId: null,
    help: false,
  });
});

test("parseArgs rejects flags with missing values", () => {
  assert.throws(() => parseArgs(["trigger", "--branch"]), /--branch requires a value/);
  assert.throws(() => parseArgs(["trigger", "--project-id"]), /--project-id requires a value/);
  assert.throws(() => parseArgs(["status", "--status-id"]), /--status-id requires a value/);
  assert.throws(() => parseArgs(["trigger", "--branch", "--project-id", "project_123"]), /--branch requires a value/);
});

test("resolveProjectId lets --project-id override environment defaults", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-project-precedence-"));
  try {
    await writeFile(path.join(root, ".env"), "MINTLIFY_PROJECT_ID=project_file\n");

    const env = loadKitEnv({
      kitHome: root,
      env: { MINTLIFY_PROJECT_ID: "project_shell" },
    });
    const options = parseArgs(["trigger", "--branch", "docs-update", "--project-id", "project_cli"]);

    assert.equal(resolveProjectId(options, env), "project_cli");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("triggerPreviewDeployment posts branch to the preview API", async () => {
  const requests = [];
  const result = await triggerPreviewDeployment({
    apiKey: "mint_secret",
    projectId: "project_123",
    branch: "docs-update",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return jsonResponse(202, {
        statusId: "status_123",
        previewUrl: "https://preview.example.com",
      });
    },
  });

  assert.deepEqual(result, {
    projectId: "project_123",
    branch: "docs-update",
    statusId: "status_123",
    previewUrl: "https://preview.example.com",
  });
  assert.equal(requests[0].url, "https://api.mintlify.com/v1/project/preview/project_123");
  assert.equal(requests[0].options.method, "POST");
  assert.equal(requests[0].options.headers.Authorization, "Bearer mint_secret");
  assert.equal(requests[0].options.body, JSON.stringify({ branch: "docs-update" }));
});

test("triggerPreviewDeployment requires API key only when the command runs", async () => {
  await assert.rejects(
    triggerPreviewDeployment({
      projectId: "project_123",
      branch: "docs-update",
      fetchImpl: async () => jsonResponse(202, {}),
    }),
    /MINTLIFY_ADMIN_API_KEY is required/,
  );
});

test("getDeploymentStatus fetches the status endpoint", async () => {
  const requests = [];
  const status = await getDeploymentStatus({
    apiKey: "mint_secret",
    statusId: "status_123",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return jsonResponse(200, {
        _id: "status_123",
        projectId: "project_123",
        status: "success",
      });
    },
  });

  assert.equal(status.status, "success");
  assert.equal(requests[0].url, "https://api.mintlify.com/v1/project/update-status/status_123");
  assert.equal(requests[0].options.method, "GET");
  assert.equal(requests[0].options.headers.Authorization, "Bearer mint_secret");
});

test("formatters return clear non-secret output", () => {
  assert.equal(
    formatPreviewResult({
      projectId: "project_123",
      branch: "docs-update",
      statusId: "status_123",
      previewUrl: "https://preview.example.com",
    }),
    [
      "Preview deployment queued",
      "projectId: project_123",
      "branch: docs-update",
      "statusId: status_123",
      "previewUrl: https://preview.example.com",
    ].join("\n"),
  );

  assert.equal(
    formatStatusResult({
      _id: "status_123",
      projectId: "project_123",
      status: "failure",
      summary: "Build failed with custom-secret-value",
      logs: ["Authorization: Bearer mint_secret", "echo custom-secret-value"],
      commit: { ref: "docs-update", sha: "abc123" },
    }, ["custom-secret-value"]),
    [
      "Deployment status",
      "statusId: status_123",
      "projectId: project_123",
      "status: failure",
      "summary: Build failed with [REDACTED]",
      "commitRef: docs-update",
      "commitSha: abc123",
      "logs:",
      "- Authorization: Bearer [REDACTED]",
      "- echo [REDACTED]",
    ].join("\n"),
  );
});

test("formatters redact known secrets from successful response fields", () => {
  assert.equal(
    formatPreviewResult({
      projectId: "custom-secret-value",
      branch: "docs-update",
      statusId: "status_123",
      previewUrl: "https://preview.example.com/custom-secret-value",
    }, ["custom-secret-value"]),
    [
      "Preview deployment queued",
      "projectId: [REDACTED]",
      "branch: docs-update",
      "statusId: status_123",
      "previewUrl: https://preview.example.com/[REDACTED]",
    ].join("\n"),
  );

  assert.equal(
    formatStatusResult({
      _id: "custom-secret-value",
      projectId: "project_123",
      status: "success",
    }, ["custom-secret-value"]),
    [
      "Deployment status",
      "statusId: [REDACTED]",
      "projectId: project_123",
      "status: success",
    ].join("\n"),
  );
});

test("redactSecrets removes Mintlify admin key shapes and known secret values", () => {
  assert.equal(
    redactSecrets("failed with Bearer mint_abc123, mint_def456, and custom-secret-value", ["custom-secret-value"]),
    "failed with Bearer [REDACTED], [REDACTED], and [REDACTED]",
  );
});

test("triggerPreviewDeployment redacts exact API key values from API errors", async () => {
  await assert.rejects(
    triggerPreviewDeployment({
      apiKey: "custom-secret-value",
      projectId: "project_123",
      branch: "docs-update",
      fetchImpl: async () => jsonResponse(401, {
        error: "invalid token custom-secret-value",
      }),
    }),
    (error) => {
      assert.match(error.message, /invalid token \[REDACTED\]/);
      assert.doesNotMatch(error.message, /custom-secret-value/);
      return true;
    },
  );
});

test("triggerPreviewDeployment redacts exact API key values from invalid JSON responses", async () => {
  await assert.rejects(
    triggerPreviewDeployment({
      apiKey: "custom-secret-value",
      projectId: "project_123",
      branch: "docs-update",
      fetchImpl: async () => ({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        text: async () => "upstream echoed custom-secret-value",
      }),
    }),
    (error) => {
      assert.match(error.message, /upstream echoed \[REDACTED\]/);
      assert.doesNotMatch(error.message, /custom-secret-value/);
      return true;
    },
  );
});

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 200 && status < 300 ? "OK" : "Error",
    text: async () => JSON.stringify(body),
  };
}
