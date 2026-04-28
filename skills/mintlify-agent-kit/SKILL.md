---
name: mintlify-agent-kit
description: Use when a task involves Mintlify docs work broadly or the right layer is unclear, including docs authoring, docs.json configuration, verification, preflight, MDX, llms.txt, mint CLI, OpenAPI, AI-facing docs, or Mintlify Agent Kit routing.
---

# Mintlify Agent Kit

## Overview

Use this root router for Mintlify documentation tasks before choosing a child skill. Its job is to classify the work, enforce shared source-of-truth rules, run only lightweight preflight, and keep the v1 kit inside its boundary.

Do not use this skill as a handbook. Load the child skill that owns the work and follow that skill for the detailed workflow.

## First Move

Read the target repository files before answering or editing. Locate the relevant docs root by finding the `docs.json` connected to the task target, changed files, deployment context, or explicit path.

If the task has more than one layer, route each layer to its owning skill. Use verification last for evidence after authoring or configuration changes.

## Routing

| Task shape | Load |
| --- | --- |
| `.mdx` prose, page structure, frontmatter wording, headings, links inside page content, examples, component choice, API-adjacent explanations, style and tone, Markdown export, or AI legibility | `mintlify-agent-kit-authoring` |
| `docs.json`, `$ref` config, navigation, page registration, redirects, `.mintignore`, hidden pages, OpenAPI or AsyncAPI wiring, API playground settings, or config-sensitive published behavior | `mintlify-agent-kit-configuration` |
| `mint validate`, `mint broken-links`, `mint a11y`, `mint dev`, `mint score`, local preview, hosted docs URLs, `/llms.txt`, `/llms-full.txt`, `.md` URLs, `Accept` header Markdown checks, or final verification evidence | `mintlify-agent-kit-verification` |
| Preview deployment API triggers, skipped automatic previews, branch preview redeploys, deployment `statusId` lookup, or project ID selection for preview deployments | `mintlify-agent-kit-deploy` |
| Missing or uncertain repo-local `mint`, CLI version, docs root, telemetry posture, auth/status, configured subdomain, command availability, Codex install, Cursor install, or doctor output | `mintlify-agent-kit-preflight` |

Use multiple child skills for mixed tasks. Examples: adding a new page usually needs authoring, configuration, then verification; changing OpenAPI navigation needs configuration, then verification; blocked `mint` availability goes to preflight before verification.

## Source Of Truth

Use this hierarchy across every child skill:

1. Existing repository docs are authoritative for product facts, public paths, route names, current navigation commitments, file layout, product terminology, and mature local conventions.
2. Official Mintlify docs are authoritative for platform mechanics, components, `docs.json` schema, CLI behavior, AI-native surfaces, Markdown export behavior, and Mintlify authoring and quality guidance.
3. Legacy, generated, migrated, or low-maturity existing docs are factual input, not a quality ceiling. Preserve verified facts while improving structure, component use, metadata, examples, and AI legibility against Mintlify and organization standards.
4. Preserve mature local conventions when they reflect deliberate product or organization decisions. Do not let weak incidental patterns override Mintlify platform guidance.

When official docs, local conventions, and observed repo-pinned behavior conflict, record the conflict as a blocked or scoped decision. Do not pretend uncertain behavior is deterministic.

## Lightweight Preflight

Keep root preflight shallow:

- Find the docs root by locating the relevant `docs.json`.
- Confirm official `mint` availability through the kit install path only when tooling state matters.
- Use `mint status` or `mint config get subdomain` only when the task requires account or project context.
- Treat hosted documentation URLs as task input, repository/deployment evidence, or per-run discovery results. Do not hardcode a hosted URL into this root skill or the kit.
- Never read, print, or manipulate Mintlify credential values from `~/.config/mintlify/config.json`.

When preflight becomes installation, doctor, telemetry, auth, subdomain, or adapter troubleshooting, load `mintlify-agent-kit-preflight`.

## Official Source Pointers

Open exact official sources when current platform mechanics matter:

- LLM entrypoint: https://www.mintlify.com/docs/llms.txt
- Full LLM context: https://www.mintlify.com/docs/llms-full.txt
- Overview: https://www.mintlify.com/docs/what-is-mintlify
- Quickstart: https://www.mintlify.com/docs/quickstart
- CLI: https://www.mintlify.com/docs/cli
- CLI install: https://www.mintlify.com/docs/cli/install
- CLI commands: https://www.mintlify.com/docs/cli/commands
- Preview deployment API: https://www.mintlify.com/docs/api/preview/trigger
- Deployment status API: https://www.mintlify.com/docs/api/update/status
- AI-native docs: https://www.mintlify.com/docs/ai-native
- `llms.txt`: https://www.mintlify.com/docs/ai/llmstxt
- Markdown export: https://www.mintlify.com/docs/ai/markdown-export

Child skills carry their exact source lists for authoring, configuration, verification, and preflight details.

## V1 Boundary

The v1 kit uses official `mint` CLI commands through the repo-local kit dependency, official Mintlify docs, direct file editing, minimal install/doctor support, and the public Mintlify preview deployment API through `mintlify-agent-kit-deploy`.

Do not create wrapper CLIs, custom analyzers, production deployment commands, REST/API plumbing outside the deploy skill's preview/status endpoints, analytics workflows, MCP remediation, Mintlify-agent workflows, or direct/private `@mintlify/*` package API integrations.

Do not duplicate child workflows in this root skill. Route to the child skill and keep final reports explicit about `passed`, `failed`, `blocked`, and `skipped` checks.
