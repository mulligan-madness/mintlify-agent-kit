---
name: mintlify-agent-kit-deploy
description: Use when Mintlify preview deployments, skipped automatic previews, branch preview redeploys, deployment status IDs, project IDs, or public deployment API work are involved.
---

# Mintlify Agent Kit Deploy

## Overview

Use this skill only for public Mintlify preview deployment API workflows. It triggers or checks hosted preview deployment work; it does not verify docs quality by itself.

## Scope

Use for:

- Creating or updating a preview deployment for a Git branch.
- Redeploying a branch preview when automatic GitHub or GitLab preview creation is skipped or unavailable.
- Checking deployment status from a `statusId`.
- Selecting a specific Mintlify project with `--project-id`.

Do not use for production deployment triggers, analytics, agent APIs, Git provider setup automation, dashboard-only workflows, offline export, local preview, or docs quality verification.

## Credential Contract

- `MINTLIFY_ADMIN_API_KEY` is optional until a deploy API command runs.
- `MINTLIFY_PROJECT_ID` is the default project for preview triggers.
- `--project-id` overrides `MINTLIFY_PROJECT_ID` for multi-project work.
- Real keys belong in shell env, CI secrets, or the ignored kit-local `.env`.
- Never print, commit, or manually inspect Mintlify credential files for API keys.
- Doctor and deploy helpers may load the ignored kit-local `.env` for readiness checks or deploy API commands.

## Workflow

Resolve kit home:

```bash
KIT_HOME="${MINTLIFY_AGENT_KIT_HOME:-$HOME/.mintlify-agent-kit}"
if [ ! -f "$KIT_HOME/package.json" ] && [ -f "$HOME/.cursor/plugins/local/mintlify-agent-kit/package.json" ]; then
  KIT_HOME="$HOME/.cursor/plugins/local/mintlify-agent-kit"
fi
```

Run preflight when deploy readiness is uncertain:

```bash
npm --prefix "$KIT_HOME" run doctor -- --docs-root <docs-root>
```

If deploy env warnings appear while the task is to trigger or check a preview deployment, report only the missing requirement as blocked. Preview triggers need `MINTLIFY_ADMIN_API_KEY` plus a project ID from `MINTLIFY_PROJECT_ID` or `--project-id`; status checks need `MINTLIFY_ADMIN_API_KEY` plus `--status-id`.

Trigger a preview:

```bash
npm --prefix "$KIT_HOME" run preview:trigger -- --branch <branch> --project-id <projectId>
```

Omit `--branch` only when the current Git branch is the intended branch. Omit `--project-id` only when `MINTLIFY_PROJECT_ID` is the intended project.

Check status:

```bash
npm --prefix "$KIT_HOME" run preview:status -- --status-id <statusId>
```

Report `previewUrl` and `statusId` from preview triggers. For status checks, summarize status, summary, timestamps, source, commit ref/SHA, and concise logs without dumping noisy output.

## Handoffs

- Use `mintlify-agent-kit-preflight` for install state, docs-root discovery, auth/status, subdomain, and deploy env readiness warnings.
- Use `mintlify-agent-kit-verification` after a preview URL exists and the task needs hosted docs checks.
- Keep authoring and configuration work in their existing skills.
