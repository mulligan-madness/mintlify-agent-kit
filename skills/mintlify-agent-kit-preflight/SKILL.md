---
name: mintlify-agent-kit-preflight
description: Use when official Mintlify tooling availability is missing or uncertain, including Mintlify Agent Kit install checks, doctor, repo-local `mint` resolution, docs-root detection, telemetry posture, auth/status preflight, and Codex or Cursor adapter troubleshooting.
---

# Mintlify Agent Kit Preflight

## Overview

Use this skill only for Mintlify Agent Kit install and preflight support.

Its job is to confirm local installation state, repo-local `mint` resolution, docs-root detection, telemetry posture, optional account/project preflight, and optional deploy environment readiness.

## Tool Contract

Use the official `mint` CLI through the kit repository. Do not require a global `mint` install and do not invent wrapper command names.

Resolve the kit home before checking tooling:

```bash
KIT_HOME="${MINTLIFY_AGENT_KIT_HOME:-$HOME/.mintlify-agent-kit}"
if [ ! -f "$KIT_HOME/package.json" ] && [ -f "$HOME/.cursor/plugins/local/mintlify-agent-kit/package.json" ]; then
  KIT_HOME="$HOME/.cursor/plugins/local/mintlify-agent-kit"
fi
```

The canonical command shape available to other skills is:

```bash
DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$KIT_HOME" exec -- mint <command> ...
```

Run that command from the target docs root when a downstream workflow invokes `mint`.

## Preflight Workflow

1. Locate the docs root by finding the nearest `docs.json` when the task has a target docs repository.
2. Run the doctor from the kit home:
   ```bash
   npm --prefix "$KIT_HOME" run doctor -- --docs-root <docs-root>
   ```
3. Add doctor flags only when the current task requires that preflight:
   - `--status` for Mintlify account/auth status.
   - `--subdomain` for configured project subdomain context.
   - `--validate` to confirm a docs root can invoke local validation.
4. Treat deploy env warnings as non-blocking unless the current task needs that value. Preview triggers need `MINTLIFY_ADMIN_API_KEY` and a project ID; status checks need `MINTLIFY_ADMIN_API_KEY` and a `statusId`.
5. If the kit is not installed, use `INSTALL.md` from the kit repository and ask which adapter target to install: `codex`, `cursor`, or `both`.
6. Report blocked checks explicitly. Do not convert missing docs roots, missing auth, deploy credentials, or unavailable hosted context into success.

## Guardrails

- Do not read, print, or manipulate Mintlify credential values.
- Do not call private `@mintlify/*` package APIs.
- Do not build or rely on custom wrapper commands for `mint` behavior.
- Keep telemetry disabled for automated checks unless the user or environment opts in.
