---
name: mintlify-agent-kit-configuration
description: Use when working on Mintlify docs configuration or site structure, including docs.json, navigation, page registration, redirects, .mintignore, hidden pages, OpenAPI or AsyncAPI wiring, API playground settings, and config-sensitive published behavior.
---

# Mintlify Agent Kit Configuration

## Overview

Use this skill for Mintlify site configuration and structure. It owns the configuration surfaces that control how a docs site is organized, published, indexed, redirected, and wired to generated API reference content.

This skill does not own `.mdx` authoring, verification execution, install/preflight, deployment, analytics, Mintlify-agent operations, wrapper CLIs, or direct/private `@mintlify/*` APIs.

## Scope And Handoffs

Own `docs.json`, `$ref` config files, navigation hierarchy, page registration, redirects, `.mintignore`, hidden pages, OpenAPI/AsyncAPI/API settings, and config-sensitive published behavior.

Hand off prose, page frontmatter wording, examples, and component decisions to `mintlify-agent-kit-authoring`.

Hand off `mint validate`, `mint broken-links`, preview, and hosted AI-surface checks to `mintlify-agent-kit-verification`.

Hand off missing repo-local `mint`, docs-root uncertainty, auth/status/subdomain, telemetry posture, Codex install, or Cursor install to `mintlify-agent-kit-preflight`.

## Context Selection

| Task Shape | Read |
| --- | --- |
| Tiny read-only config question | This `SKILL.md`, the target `docs.json`, and the exact official URL if schema or current behavior matters. |
| Material config edit or structural inspection | This `SKILL.md`, target config files, and `references/configuration-contract.md`. |
| `$ref`, navigation, redirect, `.mintignore`, hidden-page, OpenAPI, AsyncAPI, API playground, or API wiring task | This `SKILL.md`, target config files, `references/configuration-contract.md`, and the exact official URL that controls the behavior. |

## First Move

Locate the relevant docs root by finding the controlling `docs.json`.

Read `docs.json` structurally before editing.

If the touched subtree contains `$ref`, read the referenced JSON file or files before deciding where to edit.

## Always-On Rules

- Treat existing config as authoritative for current site shape and deliberate local commitments.
- Treat official Mintlify docs as authoritative for schema and platform behavior.
- Use structured JSON parsing and review; never make blind string edits to `docs.json`.
- Preserve unrelated ordering, formatting, comments where present in adjacent non-JSON files, and unrelated settings.
- Pair path changes with navigation, redirects, links, `.mintignore`, hidden/indexing behavior, and verification handoff.
- Improve weak legacy structure only when the task explicitly asks for information-architecture or site-structure improvement; otherwise preserve existing structure outside the target subtree.

## Official URLs

Open exact official URLs when current schema, platform mechanics, or output behavior matter:

- docs.json schema reference: https://www.mintlify.com/docs/organize/settings-reference
- Global settings: https://www.mintlify.com/docs/organize/settings
- Site structure: https://www.mintlify.com/docs/organize/settings-structure
- Navigation: https://www.mintlify.com/docs/organize/navigation
- API settings: https://www.mintlify.com/docs/organize/settings-api
- Redirects: https://www.mintlify.com/docs/create/redirects
- Exclude files from publishing: https://www.mintlify.com/docs/organize/mintignore
- Hidden pages: https://www.mintlify.com/docs/organize/hidden-pages
- OpenAPI setup: https://www.mintlify.com/docs/api-playground/openapi-setup
- AsyncAPI setup: https://www.mintlify.com/docs/api-playground/asyncapi-setup
- CLI commands: https://www.mintlify.com/docs/cli/commands

Use `references/configuration-contract.md` for deterministic configuration rules and handoff criteria.

## No-Go Rules

- Do not rewrite page prose from this skill.
- Do not own verification execution, install/preflight, deployment, analytics, REST API operations, or Mintlify-agent operations.
- Do not create wrapper CLIs around official `mint` behavior.
- Do not call direct/private `@mintlify/*` package APIs.
