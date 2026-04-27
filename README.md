# Mintlify Agent Kit

This repository currently provides the root router, install, doctor, preflight, verification, authoring, and configuration skill layers for the Mintlify Agent Kit.

It makes the official Mintlify CLI executable, `mint`, available through a repo-local package dependency so Codex, Cursor, and Factory/Droid skills can invoke the same deterministic toolchain without requiring a global `mint` install.

- Official dependency: [`mint`](https://www.npmjs.com/package/mint)
- Executable resolved from this repo: `npm --prefix "$MINTLIFY_AGENT_KIT_HOME" exec -- mint`
- This scope: root routing, package dependency installation, adapter installation, local doctor/preflight checks, verification guidance, `.mdx` authoring quality guidance, and site-structure configuration guidance

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
./install.sh factory
./install.sh both
./install.sh all
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

Factory/Droid:

- skill directories copied into `${FACTORY_HOME:-$HOME/.factory}/skills`
- restart Droid after install so the skills appear as slash commands

The official `mint` package is installed as a repo-local dependency, not globally.

Installed skills:

- [`mintlify-agent-kit`](skills/mintlify-agent-kit/SKILL.md) for routing broad Mintlify docs work to the authoring, configuration, verification, or preflight skill while preserving source-of-truth rules and v1 boundaries.
- [`mintlify-agent-kit-preflight`](skills/mintlify-agent-kit-preflight/SKILL.md) for install, doctor, repo-local `mint`, docs-root, telemetry, auth, subdomain, Codex, Cursor, and Factory/Droid preflight.
- [`mintlify-agent-kit-verification`](skills/mintlify-agent-kit-verification/SKILL.md) for local Mintlify checks and hosted AI-surface verification using the official `mint` CLI and direct HTTP checks.
- [`mintlify-agent-kit-authoring`](skills/mintlify-agent-kit-authoring/SKILL.md) for Mintlify `.mdx` authoring quality, content type decisions, page structure, examples, component choice, API-adjacent explanations, style and tone, Markdown export, and AI legibility.
- [`mintlify-agent-kit-configuration`](skills/mintlify-agent-kit-configuration/SKILL.md) for Mintlify `docs.json`, navigation, redirects, `.mintignore`, hidden pages, OpenAPI/AsyncAPI wiring, API playground settings, and site-structure configuration.

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
