import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, chmod, mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const installScript = path.join(repoRoot, "install.sh");

test("factory installs skills into FACTORY_HOME and links the default kit home", async () => {
  const fixture = await createInstallFixture();
  try {
    const result = runInstall("factory", fixture.env);

    assertInstallSucceeded(result);
    assert.match(result.stdout, /Installed Factory skill mintlify-agent-kit -> /);
    assert.ok(await fileExists(path.join(fixture.factoryHome, "skills", "mintlify-agent-kit", "SKILL.md")));
    assert.equal(
      await realpath(path.join(fixture.home, ".mintlify-agent-kit")),
      await realpath(repoRoot),
    );
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("factory replaces existing skill directories", async () => {
  const fixture = await createInstallFixture();
  try {
    const existingSkillDir = path.join(fixture.factoryHome, "skills", "mintlify-agent-kit");
    const staleFile = path.join(existingSkillDir, "stale.txt");
    await mkdir(existingSkillDir, { recursive: true });
    await writeFile(staleFile, "stale\n");

    const result = runInstall("factory", fixture.env);

    assertInstallSucceeded(result);
    assert.equal(await fileExists(staleFile), false);
    assert.ok(await fileExists(path.join(existingSkillDir, "SKILL.md")));
  } finally {
    await rm(fixture.root, { recursive: true, force: true });
  }
});

test("both remains Codex and Cursor only while all includes Factory", async () => {
  const bothFixture = await createInstallFixture();
  try {
    const result = runInstall("both", bothFixture.env);

    assertInstallSucceeded(result);
    assert.ok(await fileExists(path.join(bothFixture.codexHome, "skills", "mintlify-agent-kit", "SKILL.md")));
    assert.ok(await fileExists(path.join(bothFixture.cursorPluginHome, "mintlify-agent-kit", "package.json")));
    assert.ok(await fileExists(path.join(bothFixture.cursorPluginHome, "mintlify-agent-kit", ".env.example")));
    assert.equal(await fileExists(path.join(bothFixture.factoryHome, "skills", "mintlify-agent-kit", "SKILL.md")), false);
  } finally {
    await rm(bothFixture.root, { recursive: true, force: true });
  }

  const allFixture = await createInstallFixture();
  try {
    const result = runInstall("all", allFixture.env);

    assertInstallSucceeded(result);
    assert.ok(await fileExists(path.join(allFixture.codexHome, "skills", "mintlify-agent-kit", "SKILL.md")));
    assert.ok(await fileExists(path.join(allFixture.cursorPluginHome, "mintlify-agent-kit", "package.json")));
    assert.ok(await fileExists(path.join(allFixture.factoryHome, "skills", "mintlify-agent-kit", "SKILL.md")));
  } finally {
    await rm(allFixture.root, { recursive: true, force: true });
  }
});

async function createInstallFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "mintlify-agent-kit-install-"));
  const home = path.join(root, "home");
  const codexHome = path.join(root, "codex");
  const cursorPluginHome = path.join(root, "cursor-plugins");
  const factoryHome = path.join(root, "factory");
  const bin = path.join(root, "bin");

  await mkdir(home, { recursive: true });
  await mkdir(codexHome, { recursive: true });
  await mkdir(cursorPluginHome, { recursive: true });
  await mkdir(factoryHome, { recursive: true });
  await mkdir(bin, { recursive: true });
  await writeFile(path.join(bin, "npm"), "#!/bin/sh\nexit 0\n");
  await chmod(path.join(bin, "npm"), 0o755);

  return {
    root,
    home,
    codexHome,
    cursorPluginHome,
    factoryHome,
    env: {
      ...process.env,
      HOME: home,
      CODEX_HOME: codexHome,
      CURSOR_PLUGIN_HOME: cursorPluginHome,
      FACTORY_HOME: factoryHome,
      MINTLIFY_AGENT_KIT_HOME: "",
      PATH: `${bin}${path.delimiter}${process.env.PATH ?? ""}`,
    },
  };
}

function runInstall(target, env) {
  return spawnSync("zsh", [installScript, target], {
    cwd: repoRoot,
    env,
    encoding: "utf8",
  });
}

function assertInstallSucceeded(result) {
  assert.equal(result.status, 0, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
