# Mintlify Configuration Contract

Use this reference as the deterministic editing contract for Mintlify configuration work. It teaches how to inspect and change site structure without breaking navigation, redirects, publishing behavior, API reference wiring, or sibling-skill boundaries.

## Table Of Contents

- [Official Sources](#official-sources)
- [When To Read This Reference](#when-to-read-this-reference)
- [Source Of Truth](#source-of-truth)
- [Docs Root And Config Graph](#docs-root-and-config-graph)
- [Structural Editing Mechanics](#structural-editing-mechanics)
- [Navigation Contract](#navigation-contract)
- [Page Registration And Path Changes](#page-registration-and-path-changes)
- [Redirect Contract](#redirect-contract)
- [.mintignore Contract](#mintignore-contract)
- [Hidden Pages And Indexing](#hidden-pages-and-indexing)
- [API And OpenAPI Wiring](#api-and-openapi-wiring)
- [Configuration-Sensitive Handoffs](#configuration-sensitive-handoffs)
- [Verification Handoff Matrix](#verification-handoff-matrix)
- [Common Failure Modes](#common-failure-modes)

## Official Sources

Open the exact source before relying on current Mintlify schema, syntax, defaults, generated output, or platform mechanics.

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

## When To Read This Reference

Read this reference for every material configuration inspection or edit, navigation or page registration change, redirect change, `.mintignore` change, hidden-page change, OpenAPI/AsyncAPI/API settings change, API playground change, or `$ref` config task.

Tiny read-only config questions can stay lighter only when the answer is fully visible in the already-open target config and does not depend on split config, current schema behavior, generated API reference behavior, indexing behavior, or path semantics.

## Source Of Truth

Existing repository configuration defines the current site shape, local information architecture, public path commitments, and deliberate local config choices.

Official Mintlify docs define valid schema, platform mechanics, default behavior, generated output, and supported affordances.

Existing docs are factual evidence, not automatically a quality precedent. Preserve deliberate mature conventions, but do not let legacy, generated, migrated, or low-maturity structure block a requested docs-system improvement.

## Docs Root And Config Graph

Find the controlling `docs.json` before evaluating or editing configuration. In monorepos or repositories with multiple docs roots, choose the docs root connected to the task target, changed files, deployment context, or explicit user-provided path.

Read `$schema`, required fields, and the target subtree before editing. A working Mintlify site requires `name`, `theme`, `colors.primary`, and `navigation`.

Resolve the config graph before editing a split subtree:

- `$ref` can appear at any level.
- Referenced paths are relative to the file containing the `$ref`.
- Object refs merge sibling keys on top of referenced content.
- Non-object refs ignore sibling keys.
- Referenced files must be valid JSON.
- References must stay inside the project root.
- Circular refs are invalid.

If a task touches a subtree with `$ref`, read the referenced file or files and decide whether the effective setting belongs in the parent override or the referenced file.

## Structural Editing Mechanics

Parse and inspect JSON structurally before edits. Use a JSON-aware read, syntax-aware editor behavior, or a deliberate structural review of the target subtree; do not use blind string replacement against structured configuration.

Prefer minimal targeted edits to the file that owns the effective setting. Preserve unrelated config order and settings. Do not normalize or reformat an entire `docs.json` or referenced config file unless the task explicitly asks for formatting.

When choosing between editing a parent `$ref` block and a referenced file, edit the narrowest file that owns the requested behavior:

- Edit the referenced file when the change should apply everywhere that reference is used.
- Edit a sibling override beside `$ref` when the change should apply only at that parent location and the referenced value resolves to an object.
- Do not add sibling keys to a `$ref` that resolves to an array or other non-object value expecting them to merge.

Before saving a config edit, check whether the change affects paths, generated pages, navigation, redirects, indexing, ignored files, or verification scope.

## Navigation Contract

Navigation is required and controls the site's information hierarchy. Use one primary root-level navigation pattern, such as `pages`, `groups`, `tabs`, `anchors`, `dropdowns`, `products`, `versions`, or `languages`.

Each navigation level can contain one child element type. Do not mix sibling child containers such as `pages` and `groups` at the same level unless official docs and the current schema explicitly support that exact pattern.

Editing rules by navigation element:

| Element | Editing Rule |
| --- | --- |
| `pages` | Use extensionless page paths or supported endpoint references. Preserve order unless the task changes reader flow. |
| `groups` | Use groups for labeled sidebar sections. Preserve group labels, icons, tags, and ordering unless the task changes information architecture. |
| Nested groups | Use nested groups for hierarchy within an existing parent. Remember top-level groups always expand; `expanded` only affects nested groups. |
| `root` | Use `root` when clicking a group should open a main page. Check directory listing behavior when adding, moving, or removing root pages. |
| `directory` | Use `none`, `accordion`, or `card` only where group root pages should display child listings. Account for recursive inheritance and descendant overrides. |
| `expanded` | Use only for nested groups. Do not expect it to collapse top-level groups. |
| `tabs` | Use tabs for distinct documentation sections with separate URL paths. A tab can contain navigation fields or link externally with `href`. |
| `menu` | Use menu entries inside tabs for direct page access within a tab. Menu items can contain groups, pages, and external links. |
| `anchors` | Use anchors for persistent sidebar entry points. They can point to internal pages, nested navigation, or external resources. |
| `global.anchors` | Use global anchors for links that should appear across pages regardless of the active navigation section. |
| `dropdowns` | Use dropdowns for top-sidebar menu sections that direct to documentation areas or external links. |
| `products` | Use products for product-specific documentation divisions. Preserve product descriptions/icons when moving nested content. |
| `versions` | Use versions for versioned documentation. The first version is default unless another entry has `default: true`; preserve version tags. |
| `languages` | Use languages for localized navigation. Preserve language-specific banner, footer, and navbar overrides when editing localized navigation. |

Navigation edits must preserve deliberate local information architecture unless the task explicitly asks to improve it. When a current structure is weak, generated, migrated, or low-maturity and the task is to improve the docs system, use Mintlify's supported structure rather than copying incidental local shape.

## Page Registration And Path Changes

Adding a visible page requires both the page file and navigation registration in the relevant navigation subtree. Add the page where it serves the reader's path; do not append it to an unrelated group merely because that is convenient.

Removing a page requires navigation cleanup and link/redirect evaluation. Search for old path references in docs content, config, snippets, and generated navigation references before reporting the change complete.

Moving or renaming a page requires old-path to new-path redirect evaluation. Keep the redirect source and destination as URL paths, not file paths, and check whether internal links should be updated directly instead of relying on redirects.

Directory or root-page changes require checking `root`, inherited `directory` behavior, descendant overrides, and any pages that depend on the root page as a landing page.

Page prose, frontmatter wording, examples, and component decisions belong to `mintlify-agent-kit-authoring`. From this skill, change page files only when a configuration task mechanically requires a file move, path-preserving rename, or explicit handoff-approved metadata update.

## Redirect Contract

Redirects live in `docs.json` under `redirects`.

Each redirect requires `source` and `destination`. Redirects cannot include anchors such as `path#anchor` or query strings such as `path?query=value`.

Redirects are permanent by default and use 308. Set `permanent: false` only when a temporary 307 redirect is intended.

Wildcards and partial wildcards are allowed. Use `*` after a parameter to match wildcard paths, and use partial wildcard patterns for URL segments that share a prefix. Captured wildcard values can be reused in destinations.

Avoid circular redirects and redirect chains that send a path back to itself through another rule. When changing paths, verify that the new destination resolves to a valid page or route.

## .mintignore Contract

`.mintignore` lives in the docs root and uses `.gitignore` syntax.

Ignored files are not published, not indexed for search, not accessible to visitors, and not checked as valid link targets. Links that point to ignored files break.

Use `.mintignore` for drafts, internal notes, source files, or directories that must be completely excluded from processing and publishing.

Do not add default ignored patterns already handled by Mintlify unless local clarity requires it. Mintlify already ignores common development and metadata directories/files such as `.git`, `.github`, `.claude`, `.agents`, `.idea`, `.vscode`, `node_modules`, build/cache/temp directories, and common repository docs such as `README.md`, `LICENSE.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`.

Choose `.mintignore` only when complete exclusion is intended. If a page should stay directly reachable by URL or available as AI context, use hidden-page mechanics instead.

## Hidden Pages And Indexing

Hidden pages remain directly accessible by URL. Use hidden pages for content that should not appear in navigation but can still be opened directly or referenced as context.

Hide an individual page with `hidden: true` in frontmatter or by removing it from `docs.json` navigation.

If a page is hidden by frontmatter, unhide it by removing the `hidden` field; do not set `hidden: false`. If a page is hidden by navigation omission, unhide it by adding or restoring the page in the correct navigation subtree.

Hide groups or tabs with `hidden: true` in `docs.json`.

Hidden pages are excluded from search engines, site search, sitemaps, and AI context by default. Add `seo.indexing: "all"` in `docs.json` only when hidden pages should still be included in search results and assistant context.

`noindex: true` affects indexing only and does not hide a page from navigation. Use `hidden: true` to hide from navigation and indexing; use `noindex: true` only to keep a visible page out of indexing.

Strict access control belongs to authentication setup, not this skill. Do not treat hidden pages as a security boundary.

## API And OpenAPI Wiring

Top-level `api` settings configure API-related behavior:

- `api.openapi` accepts a single OpenAPI path/URL, an array, or an object with `source` and `directory`.
- `api.asyncapi` accepts a single AsyncAPI path/URL, an array, or an object with `source` and `directory`.
- `api.playground` controls playground display, proxy, and credentials behavior.
- `api.params` controls parameter expansion.
- `api.url` controls base URL display.
- `api.examples` controls autogenerated example languages, optional-parameter defaults, prefill, and autogeneration.
- `api.mdx` configures API pages built from MDX frontmatter rather than generated OpenAPI pages.

Navigation-level `openapi` can generate endpoint pages. A navigation element with `openapi` and no `pages` generates all endpoints from that spec. A navigation element with `openapi` plus `pages` can mix docs pages and selected `METHOD /path` endpoint entries.

Child navigation elements inherit parent OpenAPI specs unless they define their own. Individual endpoint entries can include an explicit spec path before `METHOD /path` to select endpoints from multiple specifications.

OpenAPI specs must be OpenAPI 3.0 or 3.1. Mintlify supports internal OpenAPI `$ref` within a single OpenAPI document; external OpenAPI refs are not supported.

When navigation or `api.openapi` points to a hosted OpenAPI URL, changes to that remote spec do not trigger a Git-push redeploy automatically. If the task requires refreshing published docs after a remote spec update, hand off or report deployment/API triggering as blocked or out of scope; do not call Mintlify deployment REST APIs from this skill.

`mint validate` validates OpenAPI specifications referenced in `docs.json`. If a config change touches OpenAPI wiring, endpoint selection, generated directories, or spec paths, hand off verification with OpenAPI validation in scope.

Navigation-level `asyncapi` can generate WebSocket channel pages. It accepts a path to an AsyncAPI schema document in the docs repo, a URL to a hosted AsyncAPI document, or an array of schema links.

Use `asyncapi` with `source` and optional `directory` when a navigation element should generate channel pages into a specific docs directory. If `directory` is omitted, Mintlify adds generated files to `api-reference`.

For selective ordering or one-channel control, Mintlify supports MDX pages with `asyncapi` frontmatter in the form `"/path/to/asyncapi.json channelName"`. Treat new MDX page creation, page prose, and frontmatter wording as authoring-owned unless the task explicitly approves a mechanical metadata-only update.

## Configuration-Sensitive Handoffs

If config work implies page prose, page frontmatter wording, examples, or component changes, hand off to `mintlify-agent-kit-authoring`.

If config work changes paths, redirects, snippets, headings, OpenAPI wiring, navigation, `.mintignore`, hidden pages, or indexing behavior, hand off to `mintlify-agent-kit-verification`.

If config work requires missing CLI availability, auth status, configured subdomain, telemetry posture, docs-root certainty, Codex install, or Cursor install context, hand off to `mintlify-agent-kit-preflight`.

## Verification Handoff Matrix

| Change | Verification Handoff |
| --- | --- |
| Any config change | `mint validate` |
| Page path, navigation, or link-affecting config change | `mint broken-links` |
| Redirects, headings, snippets, anchors, navigation paths, or page paths changed | `mint broken-links --check-anchors --check-snippets --check-redirects` |
| OpenAPI/AsyncAPI/API wiring changed | `mint validate`, with OpenAPI validation in scope |
| Hidden-page, `.mintignore`, indexing, or served discovery behavior changed | Verification-owned local checks, and hosted AI checks only when a served URL exists |

Hosted AI checks are verification-owned and require a served URL. Local preview does not prove hosted `/llms.txt`, `/llms-full.txt`, `.md` URLs, or `Accept` negotiation.

## Common Failure Modes

- Blind string edits to JSON.
- Editing the wrong docs root.
- Updating navigation but not redirects.
- Hiding content when `.mintignore` was needed, or ignoring content when hidden direct access was intended.
- Assuming hidden pages are available to AI/search.
- Breaking `$ref` resolution by moving referenced files.
- Generating all OpenAPI endpoints when selective endpoint navigation was intended.
- Drifting into prose authoring or verification execution.
