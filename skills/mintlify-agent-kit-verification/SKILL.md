---
name: mintlify-agent-kit-verification
description: Use when verifying Mintlify docs changes with mint validate, mint broken-links, mint a11y, mint dev, mint score, published docs URLs, /llms.txt, .md pages, Accept header Markdown checks, or AI-facing served surfaces.
---

# Mintlify Agent Kit Verification

## Overview

Use this skill to prove Mintlify documentation work with official `mint` CLI checks and direct HTTP checks of served Mintlify surfaces.

Keep local source checks, local preview smoke checks, and hosted AI-surface checks distinct. Do not report success without evidence from the checks that apply to the current task.

## Tool Contract

Use the official `mint` CLI through the kit repository. Do not require a global `mint` install and do not invent wrapper command names.

Resolve the kit home before invoking `mint`:

```bash
KIT_HOME="${MINTLIFY_AGENT_KIT_HOME:-$HOME/.mintlify-agent-kit}"
if [ ! -f "$KIT_HOME/package.json" ] && [ -f "$HOME/.cursor/plugins/local/mintlify-agent-kit/package.json" ]; then
  KIT_HOME="$HOME/.cursor/plugins/local/mintlify-agent-kit"
fi
```

Run all `mint` commands with telemetry disabled:

```bash
DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$KIT_HOME" exec -- mint <command> ...
```

Run local verification commands from the docs root containing `docs.json`.

## Local Verification

Always run the checks that match the diff:

- `mint validate` after Mintlify docs file changes.
- `mint broken-links` after any page content, link, navigation, or config path change.
- `mint broken-links --check-anchors --check-snippets --check-redirects` when changed files include headings, snippets, redirects, navigation entries, or page path changes.
- `mint broken-links --check-external` when the diff adds or changes external URLs.
- `mint a11y` when the diff adds or changes images, videos, colors, themes, or accessibility-sensitive visual content. This checks color contrast and image/video alt text.
- `mint dev --no-open` for rendered HTML, navigation, generated API page, or page-level smoke verification.
- `mint dev --no-open --port <port>` only when the default port is unavailable or the task supplies a port.

Local preview is not hosted AI-surface verification. Do not use `mint dev` to prove `/llms.txt`, `/llms-full.txt`, `.md` URLs, or `Accept` header Markdown negotiation. Those checks require a served hosted URL.

Local preview smoke procedure:

1. Start preview with `mint dev --no-open`, or `mint dev --no-open --port <port>` when the default port is unavailable or supplied.
2. Wait until the CLI prints the local preview URL.
3. Fetch each changed page, navigation target, generated API page, or page-level target that made preview necessary.
4. Record HTTP status, target URL, and concise rendered-content evidence.
5. Stop the preview process before reporting.
6. If preview does not start, mark the preview smoke check `blocked` with the startup output.

## Hosted Verification

Run hosted checks only when a served docs URL is supplied or discovered for the current run.

URL selection rules:

- Treat a task-supplied served URL as authoritative.
- If no URL is supplied, use explicit repository or deployment documentation only when it names a current served docs URL.
- If only `mint config get subdomain` is available, report it as candidate context and mark hosted checks blocked unless the task confirms that target.
- Do not silently use `mint score` with no URL unless the task is clearly about the configured default project.

When a hosted URL is available, run:

```bash
DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$KIT_HOME" exec -- mint score <url> --format json
```

If authentication is missing, mark only `mint score` as blocked and continue public HTTP checks against the served URL.

Summarize `mint score` JSON instead of pasting raw output. Include:

- target or canonical URL
- overall score and grade
- `report.summary`
- failed, warned, and skipped `report.results[]`
- failed, warned, and skipped `extensions[]`
- MCP extension findings as evidence only

Direct HTTP checks:

- Fetch `<url>/llms.txt` and `<url>/llms-full.txt`; require HTTP 2xx and text content.
- Inspect served root response headers for `Link` entries advertising `/llms.txt` and `/llms-full.txt`, plus `X-Llms-Txt`.
- Fetch `<url>/robots.txt` and `<url>/sitemap.xml`; report HTTP status and content type.
- For every changed published page whose URL can be determined, fetch:
  - `<page-url>`
  - `<page-url>.md`
  - `<page-url>` with `Accept: text/markdown`
  - `<page-url>` with `Accept: text/plain`
- Treat `llms.txt` and sitemap page URLs as discovery evidence, not proof. Report stale or 404 page URLs discovered there as failures.
- Check OpenAPI availability only when `mint score` reports OpenAPI findings or the docs change touches OpenAPI configuration or spec files.

Resolve changed published page URLs in this order:

1. Use task-supplied page URLs.
2. Use explicit repository or deployment documentation that maps source files to served paths.
3. Use `docs.json` navigation entries and the changed file path without the `.mdx` or `.md` extension.
4. Use matching URLs discovered in `llms.txt` or `sitemap.xml` as candidates, then verify them directly.
5. If a changed page cannot be mapped to a served URL, mark that page's hosted page checks `blocked` and report why.

Use redirect-following HTTP checks and case-insensitive header matching. Examples:

```bash
curl -fsSIL <url>
curl -fsSL <url>/llms.txt
curl -fsSL -H 'Accept: text/markdown' <page-url>
curl -fsSL -H 'Accept: text/plain' <page-url>
```

## Reporting

Every check must be reported as exactly one of:

- `passed`
- `failed`
- `blocked`
- `skipped`

Include the command, working directory, target URL when applicable, and concise evidence. Do not collapse "not applicable", "not run", and "passed" into the same outcome.

Do not paste huge `mint score` JSON into final reports. Report MCP findings from `mint score` as observed evidence only; do not create hidden MCP remediation work in v1.

## Handoffs

- Use `mintlify-agent-kit-preflight` when `mint` availability, docs-root detection, auth status, configured subdomain, telemetry posture, Codex install, or Cursor install is missing or uncertain.
- Hand authoring quality problems to the docs authoring skill when that skill exists.
- Hand `docs.json`, navigation, redirect, `.mintignore`, hidden page, and OpenAPI wiring changes to the docs configuration skill when that skill exists.
- Do not perform deployment, analytics, REST API operations, Mintlify-agent operations, custom wrapper CLI work, or direct `@mintlify/*` package API integration.
