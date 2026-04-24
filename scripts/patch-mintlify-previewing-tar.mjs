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

const DEFAULT_IMPORT = "import tar from 'tar';";
const PATCHED_IMPORT = "import * as tar from 'tar';";

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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = patchMintlifyPreviewingTarImport(process.argv[2] || DEFAULT_TARGET);
  if (result.reason === "expected-import-missing") {
    console.error("Mintlify previewing tar import did not match the expected patch target.");
    process.exitCode = 1;
  }
}
