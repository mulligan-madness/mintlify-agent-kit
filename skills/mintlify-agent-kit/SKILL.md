---
name: mintlify-agent-kit
description: Use when working with Mintlify docs through the official repo-local `mint` CLI, including install preflight, docs-root detection, validation, link checks, local preview, status, config, and agent-readiness checks.
---

# Mintlify Agent Kit

## Overview

Use this skill as the Mintlify Agent Kit entrypoint. It orients the agent to the repo-local official `mint` CLI dependency and routes work to the right Mintlify workflow as the rest of the kit grows.

## Tool Contract

Use the official `mint` CLI through the kit repository. Do not require a global `mint` install and do not invent wrapper command names.

Resolve the kit home before invoking `mint`:

```bash
KIT_HOME="${MINTLIFY_AGENT_KIT_HOME:-$HOME/.mintlify-agent-kit}"
if [ ! -f "$KIT_HOME/package.json" ] && [ -f "$HOME/.cursor/plugins/local/mintlify-agent-kit/package.json" ]; then
  KIT_HOME="$HOME/.cursor/plugins/local/mintlify-agent-kit"
fi
```

Invoke official Mintlify commands from the target docs root:

```bash
DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$KIT_HOME" exec -- mint <command> ...
```

## Workflow

1. Locate the docs root by finding the nearest `docs.json`.
2. If tooling availability is unclear, run:
   ```bash
   npm --prefix "$KIT_HOME" run doctor -- --docs-root <docs-root>
   ```
3. Use official `mint` commands directly when they fit the task:
   - `mint validate`
   - `mint broken-links`
   - `mint a11y`
   - `mint dev --no-open`
   - `mint status`
   - `mint config get subdomain`
   - `mint score <url> --format json`
4. Report blocked authenticated or hosted checks explicitly.

## Guardrails

- Do not read, print, or manipulate Mintlify credential values.
- Do not call private `@mintlify/*` package APIs.
- Do not build or rely on custom wrapper commands for `mint` behavior.
- Keep telemetry disabled for automated checks unless the user or environment opts in.
