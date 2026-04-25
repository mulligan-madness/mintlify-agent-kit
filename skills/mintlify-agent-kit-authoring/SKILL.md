---
name: mintlify-agent-kit-authoring
description: Use when editing Mintlify .mdx docs content, frontmatter, titles, descriptions, headings, links, examples, component choice, API-adjacent explanations, style and tone, Markdown export, or AI-legibility decisions.
---

# Mintlify Agent Kit Authoring

## Overview

Use this skill for local Mintlify `.mdx` authoring quality. It governs page structure, content type, examples, style and tone, terminology, API-adjacent explanations, component choice, Markdown export awareness, and AI legibility.

## Scope And Handoffs

Own local `.mdx` authoring quality: prose, examples, headings, frontmatter wording, links inside page content, component choice, AI-readable structure, and Markdown consumption concerns.

Hand off:

- `docs.json`, navigation, page registration, redirects, `.mintignore`, hidden pages, and OpenAPI wiring to the configuration skill.
- Local verification, local preview, hosted AI-surface checks, link checks, accessibility checks, and final evidence to the verification skill.
- Missing or uncertain official Mintlify tooling, docs-root detection, telemetry posture, auth/status, configured subdomain, Codex install, or Cursor install to `mintlify-agent-kit-preflight`.

Do not perform deployment, analytics, REST API operations, Mintlify-agent operations, custom wrapper CLI work, direct/private `@mintlify/*` package API integration, or bespoke MDX quality analyzer work.

## Context Selection

| Task Shape | Read |
| --- | --- |
| Tiny typo, grammar, or local copy edit with no structural effect | This `SKILL.md` and the target file. |
| Material prose or page edit with no component impact | This `SKILL.md`, target files, nearby docs/source evidence, and `references/authoring-contract.md`. |
| New page, page-type change, or substantial restructuring | This `SKILL.md`, target/source evidence, `references/authoring-contract.md`, https://www.mintlify.com/docs/guides/content-types, and https://www.mintlify.com/docs/guides/content-templates. |
| Frontmatter, title, description, heading, link, or anchor strategy changes | This `SKILL.md`, target files, `references/authoring-contract.md`, and the relevant exact URL for Pages, SEO, Linking, or Format text. |
| Examples, code blocks, API-adjacent explanations, or SDK examples | This `SKILL.md`, `references/authoring-contract.md`, source/OpenAPI/schema/runtime evidence, and the relevant Format code, manual API page, or SDK example URL. Add `references/components.md` when API components are used. |
| Media, screenshot, embed, or accessibility-sensitive visual content | This `SKILL.md`, `references/authoring-contract.md`, and the Media, Accessibility, or Images and embeds URL that controls the edit. Add `references/components.md` for framed or component-rendered visual content. |
| Component-only mechanical fix, such as invalid `Tab` or `Step` nesting | This `SKILL.md`, target file, `references/components.md`, and the exact component URL if syntax or semantics are uncertain. |
| Material edit that adds, removes, replaces, restructures, or relies on a component | This `SKILL.md`, target files, `references/authoring-contract.md`, `references/components.md`, and exact component URLs when mechanics matter. |
| `Visibility`, `View`, Markdown export, or human-vs-agent content behavior | This `SKILL.md`, target files, both references, https://www.mintlify.com/docs/components/visibility, and https://www.mintlify.com/docs/ai/markdown-export. Use GEO and AI-native URLs when answerability or AI consumption is part of the task. |
| Custom React component work | This `SKILL.md`, target files, `references/components.md`, https://www.mintlify.com/docs/customize/react-components, and `references/authoring-contract.md` if page content changes. |
| `docs.json`, navigation, page registration, redirects, `.mintignore`, hidden pages, OpenAPI wiring, verification, install/preflight, deployment, analytics | Do not solve in this authoring skill. Hand off to the sibling skill or layer. |

## Material Edit Threshold

A material edit is any change that adds, removes, or restructures sections; changes examples; changes headings or frontmatter; adds, removes, replaces, or restructures components; rewrites more than a paragraph; changes API-adjacent facts; changes content intended for AI/Markdown consumption; or improves legacy, generated, migrated, or low-maturity docs.

Tiny typo, grammar, and local phrasing fixes can stay lighter.

## First Move

Read the target `.mdx`, nearby docs/navigation context, and source evidence needed by the edit before changing content. Product truth comes from source code, schemas, OpenAPI, runtime behavior, and verified existing docs. Do not invent behavior from naming, convention, plausibility, or generic developer expectations.

## Page Contract Rule

Before material edits, privately determine the page contract: intended reader, reader goal, content type, factual sources, desired reader outcome, and AI/search consumption need. Ground the contract in docs/source evidence first, then tacit audience or product knowledge from the person asking you to edit the docs when available. Use it to decide what to change; do not add the contract to the page unless the page itself needs that context.

Ask a concise clarifying question only when the reader, reader goal, maturity standard, terminology, or success state cannot be inferred from docs/source evidence and the answer would materially change the edit. Do not block on this for routine targeted edits. If no answer is available or the task is narrow, proceed with the narrowest contract supported by evidence and state the assumption.

## Always-On Authoring Rules

- Choose a primary content type before material edits.
- Keep one page focused; avoid mixed-purpose pages unless the structure clearly serves the docs reader.
- Every material page must be written for one primary reader.
- Lead with the answer, task outcome, or concept definition before background.
- Put the direct path before alternatives, caveats, and edge cases.
- Frontmatter `title` and `description` must support navigation, search, `llms.txt`, and Markdown consumption.
- Titles must match reader/search intent and be unique.
- Descriptions must say what the reader will accomplish or understand, not merely what the page contains.
- Do not add a manual H1 in the body unless official Mintlify page behavior or local convention proves it is required for the target docs set.
- Use sentence-case headings, do not skip heading levels, and phrase headings around reader intent rather than internal taxonomy.
- Use second person for reader-facing instructions, prefer active voice, and keep paragraphs concise.
- Treat existing docs as evidence, not as an accuracy guarantee; preserve old information only when supported by product truth, code/schema/OpenAPI/runtime evidence, mature docs, or explicit business/product context.
- Use Mintlify components only when they improve comprehension, navigation, scanning, execution, API clarity, progressive disclosure, or agent-facing consumption.
- Avoid vague marketing claims that cannot be cited or verified.
- Broad rewrites are inappropriate when the task asks for a targeted docs change.

## Reference Triggers

Read `references/authoring-contract.md` for every material prose/page edit, new page, broad rewrite, legacy/generated/migrated content improvement, content type decision, example rewrite, API-adjacent explanation, media/link/frontmatter/heading strategy change, or AI/Markdown consumption concern.

Read `references/components.md` whenever a material edit adds, removes, replaces, or restructures a Mintlify component; changes content where the component controls meaning, order, visibility, navigation, API rendering, or Markdown export; or when basic Markdown may not express the content's information shape clearly. Prefer prose, headings, lists, tables, and code blocks when they preserve the reader goal. Prefer built-in Mintlify components before custom React.

## Official URLs

Open exact official URLs when current platform mechanics, syntax, props, or output behavior matter:

- Content types: https://www.mintlify.com/docs/guides/content-types
- Style and tone: https://www.mintlify.com/docs/guides/style-and-tone
- GEO: https://www.mintlify.com/docs/guides/geo
- Pages: https://www.mintlify.com/docs/organize/pages
- Markdown export: https://www.mintlify.com/docs/ai/markdown-export
- Component overview: https://www.mintlify.com/docs/components
- Visibility: https://www.mintlify.com/docs/components/visibility

## No-Go Rules

- Do not build or invoke a custom analyzer for docs quality.
- Do not create wrapper CLI commands around official `mint` behavior.
- Do not call direct/private `@mintlify/*` package APIs.
- Do not own config/navigation/OpenAPI wiring, verification execution, install/preflight, deployment, analytics, or Mintlify-agent operations from this skill.
