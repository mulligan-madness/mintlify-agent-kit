#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_TARGET = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "@mintlify",
  "previewing",
  "dist",
  "local-preview",
  "client.js",
);
export const DEFAULT_JS_YAML_TARGET = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "js-yaml",
  "index.js",
);

const DEFAULT_IMPORT = "import tar from 'tar';";
const PATCHED_IMPORT = "import * as tar from 'tar';";
const DEFAULT_JS_YAML_ALIASES = `// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');`;
const PATCHED_JS_YAML_ALIASES = `// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = module.exports.load;
module.exports.safeLoadAll         = module.exports.loadAll;
module.exports.safeDump            = module.exports.dump;`;

export function patchMintlifyPreviewingTarImport(targetPath = DEFAULT_TARGET) {
  if (!existsSync(targetPath)) {
    return { changed: false, reason: "target-missing" };
  }

  const source = readFileSync(targetPath, "utf8");
  if (source.includes(PATCHED_IMPORT)) {
    return { changed: false, reason: "already-patched" };
  }

  if (!source.includes(DEFAULT_IMPORT)) {
    return { changed: false, reason: "expected-import-missing" };
  }

  writeFileSync(targetPath, source.replace(DEFAULT_IMPORT, PATCHED_IMPORT));
  return { changed: true, reason: "patched" };
}

export function patchJsYamlCompatibilityAliases(targetPath = DEFAULT_JS_YAML_TARGET) {
  if (!existsSync(targetPath)) {
    return { changed: false, reason: "target-missing" };
  }

  const source = readFileSync(targetPath, "utf8");
  if (source.includes(PATCHED_JS_YAML_ALIASES)) {
    return { changed: false, reason: "already-patched" };
  }

  if (!source.includes(DEFAULT_JS_YAML_ALIASES)) {
    return { changed: false, reason: "expected-aliases-missing" };
  }

  writeFileSync(targetPath, source.replace(DEFAULT_JS_YAML_ALIASES, PATCHED_JS_YAML_ALIASES));
  return { changed: true, reason: "patched" };
}

export function patchMintlifyInstalledPackages({
  tarTarget = DEFAULT_TARGET,
  jsYamlTarget = DEFAULT_JS_YAML_TARGET,
} = {}) {
  return {
    tar: patchMintlifyPreviewingTarImport(tarTarget),
    jsYaml: patchJsYamlCompatibilityAliases(jsYamlTarget),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = patchMintlifyInstalledPackages({
    tarTarget: process.argv[2] || DEFAULT_TARGET,
  });
  if (result.tar.reason === "expected-import-missing") {
    console.error("Mintlify previewing tar import did not match the expected patch target.");
    process.exitCode = 1;
  }
  if (result.jsYaml.reason === "expected-aliases-missing") {
    console.error("js-yaml compatibility aliases did not match the expected patch target.");
    process.exitCode = 1;
  }
}
