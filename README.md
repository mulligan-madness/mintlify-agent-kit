# Mintlify Agent Kit

`mintlify-agent-kit` is a reusable Codex and Cursor package for working with the official Mintlify CLI executable, `mint`.

This repo is not a replacement CLI.

- Official dependency: [`mint`](https://www.npmjs.com/package/mint)
- Executable resolved from this repo: `npm --prefix "$MINTLIFY_AGENT_KIT_HOME" exec -- mint`
- This repo: agent skills, helper scripts, install docs, and adapter packaging

## What You Need First

Install Node.js `20.17.0` or newer, matching Mintlify's published CLI prerequisite.

Verify:

```bash
node --version
npm --version
```

## Manual Install

Detailed install steps live in [INSTALL.md](INSTALL.md).

Use the helper script:

```bash
./install.sh codex
./install.sh cursor
./install.sh both
```

## What Gets Installed

Codex:

- skill directories copied into `${CODEX_HOME:-$HOME/.codex}/skills`

Cursor:

- a local plugin copied into `${CURSOR_PLUGIN_HOME:-$HOME/.cursor/plugins/local}/mintlify-agent-kit`
- the plugin exposes the same shared `skills/` tree to Cursor

The official `mint` package is installed as a repo-local dependency, not globally.

## Verify

Run:

```bash
npm run doctor
```

From a Mintlify docs root, or with an explicit docs root:

```bash
npm run doctor -- --docs-root /path/to/docs --validate
```

## Included Skills

1. `mintlify-agent-kit`
