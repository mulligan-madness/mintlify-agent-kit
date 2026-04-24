# Mintlify Agent Kit

This repository currently provides the install, doctor, preflight, and verification skill layers for the Mintlify Agent Kit.

It makes the official Mintlify CLI executable, `mint`, available through a repo-local package dependency so Codex and Cursor skills can invoke the same deterministic toolchain without requiring a global `mint` install.

- Official dependency: [`mint`](https://www.npmjs.com/package/mint)
- Executable resolved from this repo: `npm --prefix "$MINTLIFY_AGENT_KIT_HOME" exec -- mint`
- This scope: package dependency installation, adapter installation, local doctor/preflight checks, and verification guidance

## What You Need First

Install Node.js `20.17.0` or newer, matching Mintlify's published CLI prerequisite.

Verify:

```bash
node --version
npm --version
```

## Install

Detailed install steps live in [INSTALL.md](INSTALL.md).

Use the helper script:

```bash
./install.sh codex
./install.sh cursor
./install.sh both
```

## What Gets Installed

Package dependencies:

- repo-local `mint` dependency from `package.json` and `package-lock.json`
- no global `mint` install

Codex:

- skill directories copied into `${CODEX_HOME:-$HOME/.codex}/skills`

Cursor:

- a local plugin copied into `${CURSOR_PLUGIN_HOME:-$HOME/.cursor/plugins/local}/mintlify-agent-kit`
- the plugin exposes the same shared `skills/` tree to Cursor

The official `mint` package is installed as a repo-local dependency, not globally.

Installed skills:

- [`mintlify-agent-kit-preflight`](skills/mintlify-agent-kit-preflight/SKILL.md) for install, doctor, repo-local `mint`, docs-root, telemetry, auth, subdomain, Codex, and Cursor preflight.
- [`mintlify-agent-kit-verification`](skills/mintlify-agent-kit-verification/SKILL.md) for local Mintlify checks and hosted AI-surface verification using the official `mint` CLI and direct HTTP checks.

## Doctor

Run:

```bash
npm run doctor
```

From a Mintlify docs root, or with an explicit docs root:

```bash
npm run doctor -- --docs-root /path/to/docs --validate
```

The doctor reports local state such as Node.js version, npm availability, repo-local `mint`, adapter target, telemetry posture, docs root detection, and optional safe Mintlify checks.
