# Mintlify Authoring Contract

Use this reference as the writing-quality standard for material Mintlify `.mdx` edits. It teaches how to make docs useful, accurate, Mintlify-native, and AI-legible; it is not a syntax encyclopedia.

## Table Of Contents

- [Official Sources](#official-sources)
- [When To Read This Reference](#when-to-read-this-reference)
- [Page Contract Workflow](#page-contract-workflow)
- [Audience And Reader Goal](#audience-and-reader-goal)
- [Terminology](#terminology)
- [Content Type Decision Guide](#content-type-decision-guide)
- [Information Hierarchy And Flow](#information-hierarchy-and-flow)
- [Frontmatter, Headings, Search, And Links](#frontmatter-headings-search-and-links)
- [Voice, Style, And Claims](#voice-style-and-claims)
- [Examples And Code](#examples-and-code)
- [API-Adjacent And Developer Writing](#api-adjacent-and-developer-writing)
- [Formatting Primitives](#formatting-primitives)
- [Media And Accessibility](#media-and-accessibility)
- [AI Legibility And Markdown Export](#ai-legibility-and-markdown-export)
- [Broad Improvement And Legacy Content](#broad-improvement-and-legacy-content)
- [Component Decision Checkpoint](#component-decision-checkpoint)
- [Handoffs](#handoffs)

## Official Sources

Open the exact source before relying on exact Mintlify syntax, behavior, props, generated output, or platform mechanics.

Core writing quality:

- Content types: https://www.mintlify.com/docs/guides/content-types
- Content templates: https://www.mintlify.com/docs/guides/content-templates
- Developer documentation: https://www.mintlify.com/docs/guides/developer-documentation
- Style and tone: https://www.mintlify.com/docs/guides/style-and-tone
- Improve docs: https://www.mintlify.com/docs/guides/improving-docs
- Understand your audience: https://www.mintlify.com/docs/guides/understand-your-audience
- Linking: https://www.mintlify.com/docs/guides/linking
- SEO: https://www.mintlify.com/docs/guides/seo
- Maintenance: https://www.mintlify.com/docs/guides/maintenance
- Accessibility: https://www.mintlify.com/docs/guides/accessibility
- Media: https://www.mintlify.com/docs/guides/media
- GEO: https://www.mintlify.com/docs/guides/geo

Mintlify page and Markdown authoring:

- Pages: https://www.mintlify.com/docs/organize/pages
- Format text: https://www.mintlify.com/docs/create/text
- Format code: https://www.mintlify.com/docs/create/code
- Images and embeds: https://www.mintlify.com/docs/create/image-embeds
- Reusable snippets: https://www.mintlify.com/docs/create/reusable-snippets
- Lists and tables: https://www.mintlify.com/docs/create/list-table

AI and Markdown surfaces:

- Markdown export: https://www.mintlify.com/docs/ai/markdown-export
- AI-native documentation: https://www.mintlify.com/docs/ai-native
- `llms.txt`: https://www.mintlify.com/docs/ai/llmstxt

API-adjacent authoring:

- Manual API pages in MDX: https://www.mintlify.com/docs/api-playground/mdx-setup
- Add SDK examples: https://www.mintlify.com/docs/api-playground/adding-sdk-examples

Use [components.md](components.md) for component decisions instead of duplicating component guidance here.

## When To Read This Reference

Read this reference for every material prose or page edit, new page, broad rewrite, legacy/generated/migrated content improvement, content type decision, example rewrite, API-adjacent explanation, media/link/frontmatter/heading strategy change, or AI/Markdown consumption concern.

Tiny typo, grammar, and local phrasing fixes can stay lighter when they do not change meaning, structure, examples, components, metadata, headings, links, or AI-facing content.

## Page Contract Workflow

Before material edits, privately determine the page contract: intended reader, reader goal, content type, factual sources, desired reader outcome, and AI/search consumption need. Ground the contract in docs/source evidence first, then tacit audience or product knowledge from the person asking you to edit the docs when available. Use it to decide what to change; do not add the contract to the page unless the page itself needs that context.

Use docs/source evidence before tacit knowledge from the person asking. Read the target file, nearby pages, relevant navigation context, linked docs, source code, schemas, OpenAPI, runtime behavior, or mature existing docs needed by the edit.

Ask one focused question only when the answer would materially change structure, scope, maturity standard, terminology, or success state. Do not block on questions for routine targeted edits. If the task is targeted or no answer is available, proceed with the narrowest supported contract and state the assumption.

Do not make final page copy start with a visible meta-cognitive brief. The page contract is a private authoring frame.

## Audience And Reader Goal

Every material page must be written for one primary reader. Avoid optimizing one page for hypothetical audiences or generic developer expectations when docs/source evidence points elsewhere.

Infer the docs reader's goal from page title and description, current page content, nearby navigation, linked pages, mature existing docs, public paths, API/schema/OpenAPI shape, and issue/project context when the current task provides it. If evidence is insufficient and the answer would affect page structure or scope, ask one focused question. If the edit is targeted or no answer is available, choose the narrowest reader goal supported by evidence and avoid broad reframing.

Do not treat the prompt that triggered the edit as reader-goal evidence unless it contains explicit audience or product context. The docs are written ahead of time for readers, not just-in-time for the person prompting the agent.

Calibrate explanation depth to the reader's knowledge level. Define terms only when the target reader needs them; otherwise link to deeper context. New users need orientation, milestones, limited choices, and confirmation. Experienced readers need scannable structure, dense accurate information, and minimal context. Reference readers need completeness and consistency.

## Terminology

Prefer terminology in this order: mature existing docs; current page and nearby navigation; linked docs in the same docs set; public paths and route names; API/schema/OpenAPI names; terminology supplied by the person asking only when they identify it as audience or product language; then repo/internal names only when externally exposed or confirmed by docs/source evidence.

Do not treat casual prompt wording as reader vocabulary. Do not invent keywords. When reader-facing language and product terminology differ, pair them once, then use the confirmed product term consistently.

Treat existing mature docs as terminology evidence, not as an automatic quality standard. Use search phrasing only when supported by mature docs, page/navigation context, public routes, API/schema/OpenAPI names, or explicit audience/product context.

This source order is a terminology rule, not a universal source-order rule for every authoring decision.

## Content Type Decision Guide

Choose a primary content type before material edits. Open Content types and Content templates for new pages or substantial page-type restructuring.

Tutorial:

- Use for one complete working outcome.
- Minimize choices and tell the reader what to do.
- Make milestones visible.
- Include only enough explanation to keep the reader moving.

How-to:

- Use for one specific task.
- Start from the task and get directly to the solution.
- Include prerequisites only when needed.
- Put background only where it affects execution.

Reference:

- Use for complete, accurate, scannable lookup material.
- Stay consistent with the documented system.
- Document defaults, limits, options, and edge cases when verified.
- Keep explanations minimal unless they clarify a field or option.

Explanation:

- Use to answer why or how.
- Name tradeoffs and connect concepts.
- Link to action-oriented pages instead of turning the explanation into a how-to.

If a page mixes types, keep one primary type and make the secondary material clearly support the reader's goal. Split the page or hand off to configuration/navigation work when the mix creates separate journeys.

## Information Hierarchy And Flow

Lead with the answer, task outcome, or concept definition before background. Put the direct path before alternatives, caveats, and edge cases.

Use progressive disclosure: immediate path first, deeper explanation later or linked. Make every section answer a likely reader question.

First paragraphs must quickly orient the reader: what this is, who it is for, and what they can accomplish or understand. Do not open with vague product value, internal history, or architecture unless the reader's goal is specifically conceptual.

Keep one page focused. Avoid mixed-purpose pages unless the structure clearly serves the docs reader.

## Frontmatter, Headings, Search, And Links

Frontmatter `title` and `description` must support navigation, search, `llms.txt`, and Markdown consumption.

Titles must match reader/search intent and be unique. Descriptions must say what the reader will accomplish or understand, not merely what the page contains.

Do not add a manual H1 unless verified as needed for the target docs set. Mintlify normally uses the `title` frontmatter as the page H1.

Use sentence-case headings, do not skip heading levels, and phrase headings around reader intent. Prefer question or task-oriented headings when they match reader/search intent.

Link text must make sense out of context. Links must answer the reader's next question: prerequisites, related tasks, deeper concepts, or reference detail. Prefer root-relative internal links and stable anchors when editing links.

Use custom heading IDs when a frequently linked heading needs a stable anchor across wording changes. Open Pages, Linking, SEO, or Format text when exact behavior affects the edit.

## Voice, Style, And Claims

Use second person for reader-facing instructions. Prefer active voice. Keep paragraphs concise.

Be direct without being terse. Remove filler such as "it is worth noting", "in order to", "please note", and "simply" unless a word materially changes meaning.

Avoid vague marketing claims that cannot be cited or verified. Be specific with values, limits, outcomes, and examples only when verified.

Use consistent capitalization for product names, UI names, object names, and API names. Avoid colloquialisms and idioms that are hard to translate or parse.

## Examples And Code

Examples must be executable, copied from a verified source, or structurally faithful to the real API. Use realistic names and values while avoiding secrets, fake guarantees, invented API behavior, or fictional defaults.

Use examples to teach a real pattern, not merely prove syntax. Preserve enough context around code blocks so readers and AI know when and why to use them. Show the expected result or verification when success is ambiguous.

Label code blocks with the language. Use code block metadata such as title, line highlighting, focus, line numbers, wrapping, expandable blocks, or diffs only when it improves comprehension or copyability.

Open Format code, manual API pages, and Add SDK examples when syntax or API example mechanics matter.

## API-Adjacent And Developer Writing

Product truth comes from source code, schemas, OpenAPI, runtime behavior, or verified existing docs. Do not invent behavior from naming, convention, plausibility, or generic developer expectations.

API-adjacent prose must not invent defaults, limits, auth behavior, errors, side effects, lifecycle behavior, pagination behavior, rate limits, retries, webhooks, SDK behavior, or operational guarantees.

For broad developer-doc coverage, evaluate setup, authentication, requests/responses, SDKs, errors, limits, pagination, webhooks, versioning, and troubleshooting; include only the areas that are relevant and verified.

Include troubleshooting only for likely failure modes with verified fixes. API component work must also read [components.md](components.md) because API examples and field descriptions are both component structure and content quality.

## Formatting Primitives

Use lists, tables, and code blocks when they match the information shape.

Use tables for comparable structured facts. Include meaningful headers so the table remains accessible and understandable.

Use lists for sequences, grouped guidance, or scan-friendly criteria. Use numbered lists for ordered actions and bullets for unordered groups.

Use code blocks for copyable commands, code, payloads, file trees, and structured examples. Use inline code for literal values, file paths, commands, props, fields, and identifiers.

Use snippets for repeated content only when they improve maintainability without weakening Markdown export or agent-readable context. Do not hide page-specific context in snippets merely to reduce repetition.

Open the exact Format text, Format code, Images and embeds, Reusable snippets, or Lists and tables URL when exact syntax matters.

## Media And Accessibility

Add media only when it materially improves understanding. Avoid screenshots or videos for simple actions, fast-changing UI, or decoration.

Prefer text with media as a supplement, not a replacement. Provide meaningful alt/context when media carries information. Do not rely on images, screenshots, video, color, or diagrams alone to convey critical information.

Keep visual components, screenshots, diagrams, and custom React accessible and useful outside the rendered web page when AI or Markdown consumption matters.

Use descriptive, kebab-case filenames for media. Keep images under documented size limits or use an external host when necessary. Avoid SVG `foreignObject` risks unless the exact behavior has been checked.

Open Media, Accessibility, Images and embeds, or https://www.mintlify.com/docs/components/mermaid-diagrams when the edit depends on visual or accessibility behavior.

## AI Legibility And Markdown Export

AI legibility is a first-class docs quality bar. Keep pages direct, specific, structured, and self-contained enough for AI and Markdown consumers to cite accurately. Do not hide agent-essential content in structures that degrade poorly in Markdown export or AI surfaces.

AI-facing content must be direct, specific, structured, and self-contained enough to cite. Use specific noun references instead of ambiguous pronouns where excerpts may lose context.

Keep Markdown export and agent consumption in mind while authoring. Mintlify exposes Markdown with `.md` URLs and `Accept: text/markdown` or `Accept: text/plain`; served AI-surface verification belongs to the verification skill.

Use page descriptions carefully because `llms.txt` uses page descriptions and truncates them. Pages without descriptions have weaker AI index context.

Open GEO, Markdown export, AI-native, and `llms.txt` when AI-surface or Markdown export behavior materially affects the edit.

## Broad Improvement And Legacy Content

Existing docs are useful as evidence for facts, terminology, and mature local conventions, but not automatically a quality standard or accuracy guarantee. Preserve existing information only when it remains supported by product truth, code/schema/OpenAPI/runtime evidence, mature docs, or explicit business/product context supplied in the task; otherwise verify, revise, or remove it while improving the page against the authoring contract.

Treat generated or migrated content as raw material: keep accurate facts, improve structure, remove placeholder phrasing, and align with reader goals.

For broad improvement tasks, prioritize key journeys, high-risk pages, high-traffic pages, specific reader feedback, support pain, and product context from the person asking over evenly polishing everything.

When content may age, add or preserve version, deprecation, or source-of-truth context rather than making timeless claims.

Broad rewrites are inappropriate when the task asks for a targeted docs change.

## Component Decision Checkpoint

During material authoring, evaluate the content's information shape before deciding between plain Markdown and a component. Start with the simplest form that preserves the reader goal: prose, headings, lists, tables, and code blocks. Read `components.md` when the content needs semantics that basic Markdown does not express clearly: ordered workflow state, comparison between alternatives, progressive disclosure, verified priority or risk, API field/example structure, navigation to related actions, human-vs-agent visibility, or client-side interaction. Do not choose components for visual richness alone. Do not avoid components when the reader's task, API accuracy, navigation path, or AI/Markdown consumption depends on the structure the component provides.

## Handoffs

Hand off `docs.json`, navigation, page registration, redirects, `.mintignore`, hidden pages, and OpenAPI wiring to the configuration skill.

Hand off local source checks, local preview smoke checks, hosted AI-surface checks, link checks, accessibility checks, and final verification evidence to the verification skill.

Hand off missing or uncertain official Mintlify tooling, docs-root detection, telemetry posture, auth/status, configured subdomain, Codex install, or Cursor install to the preflight skill.

Do not perform deployment, analytics, REST API operations, Mintlify-agent operations, custom wrapper CLI work, direct/private `@mintlify/*` package API integration, or bespoke MDX quality analyzer work from this authoring skill.
