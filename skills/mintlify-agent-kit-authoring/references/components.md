# Mintlify Component Guidance

Use this reference as the component-use and component-development decision manual for Mintlify `.mdx` authoring. It is not a prop encyclopedia. Exact syntax, props, current availability, and current behavior come from the official URLs below.

## Table Of Contents

- [Official Sources](#official-sources)
- [When To Read This Reference](#when-to-read-this-reference)
- [First Principles](#first-principles)
- [Plain Markdown Baseline](#plain-markdown-baseline)
- [Built-In Component Taxonomy](#built-in-component-taxonomy)
- [Decision Guide By Information Shape](#decision-guide-by-information-shape)
- [Official URL Opening Rules](#official-url-opening-rules)
- [Show/Hide And Markdown Export Risks](#showhide-and-markdown-export-risks)
- [API Component Rules](#api-component-rules)
- [Custom React Criteria](#custom-react-criteria)
- [Pinned Behavior Evidence](#pinned-behavior-evidence)
- [Component Failure Modes](#component-failure-modes)
- [Verification Handoff Triggers](#verification-handoff-triggers)

## Official Sources

Component sources:

- Component overview: https://www.mintlify.com/docs/components
- Accordions: https://www.mintlify.com/docs/components/accordions
- Badge: https://www.mintlify.com/docs/components/badge
- Banner: https://www.mintlify.com/docs/components/banner
- Callouts: https://www.mintlify.com/docs/components/callouts
- Cards: https://www.mintlify.com/docs/components/cards
- Code groups: https://www.mintlify.com/docs/components/code-groups
- Color: https://www.mintlify.com/docs/components/color
- Columns: https://www.mintlify.com/docs/components/columns
- Examples: https://www.mintlify.com/docs/components/examples
- Expandables: https://www.mintlify.com/docs/components/expandables
- Fields: https://www.mintlify.com/docs/components/fields
- Frames: https://www.mintlify.com/docs/components/frames
- Icons: https://www.mintlify.com/docs/components/icons
- Mermaid diagrams: https://www.mintlify.com/docs/components/mermaid-diagrams
- Panel: https://www.mintlify.com/docs/components/panel
- Prompt: https://www.mintlify.com/docs/components/prompt
- Response fields: https://www.mintlify.com/docs/components/responses
- Steps: https://www.mintlify.com/docs/components/steps
- Tabs: https://www.mintlify.com/docs/components/tabs
- Tiles: https://www.mintlify.com/docs/components/tiles
- Tooltips: https://www.mintlify.com/docs/components/tooltips
- Tree: https://www.mintlify.com/docs/components/tree
- Update: https://www.mintlify.com/docs/components/update
- View: https://www.mintlify.com/docs/components/view
- Visibility: https://www.mintlify.com/docs/components/visibility
- Custom React: https://www.mintlify.com/docs/customize/react-components

Related mechanics:

- Markdown export: https://www.mintlify.com/docs/ai/markdown-export
- Format code: https://www.mintlify.com/docs/create/code
- Images and embeds: https://www.mintlify.com/docs/create/image-embeds
- Reusable snippets: https://www.mintlify.com/docs/create/reusable-snippets
- Linking: https://www.mintlify.com/docs/guides/linking
- Accessibility: https://www.mintlify.com/docs/guides/accessibility
- Manual API pages: https://www.mintlify.com/docs/api-playground/mdx-setup
- Add SDK examples: https://www.mintlify.com/docs/api-playground/adding-sdk-examples

## When To Read This Reference

Read `components.md` whenever:

- a material edit adds, removes, replaces, or restructures a Mintlify component;
- content meaning, order, visibility, navigation, API rendering, Markdown export, anchors, or reader flow depends on a component;
- basic Markdown may not express the content's information shape clearly;
- the task asks whether a component should be used;
- the page uses `Visibility`, `View`, tabs/code groups, API field/example components, show/hide components, Mermaid, media frames, or custom React;
- custom React is being considered.

Also read [authoring-contract.md](authoring-contract.md) when component work changes page prose, examples, reader flow, API facts, headings, links, frontmatter, or AI/Markdown consumption.

## First Principles

Components are semantic documentation tools. Use them to encode information shape, workflow state, audience visibility, API structure, navigation, verified priority, or interaction that plain Markdown cannot express as clearly. Component choice is part of authoring quality, not a visual polish step.

Prefer built-in Mintlify components before custom React. Do not use components merely to make a page look richer.

## Plain Markdown Baseline

Start with the simplest form that preserves the reader goal: prose, headings, lists, tables, and code blocks.

Prefer plain Markdown when it preserves the reader goal clearly. Do not introduce a component when a list, table, heading structure, or code block carries the same meaning with less complexity.

Do not avoid components when the reader's task, API accuracy, navigation path, progressive disclosure, interaction, or AI/Markdown consumption depends on the structure the component provides.

## Built-In Component Taxonomy

Use component purpose, not visual preference, as the first selection filter.

| Purpose | Components |
| --- | --- |
| Structure content | `Tabs`, `CodeGroup`, `Steps`, `Columns`, `Panel` |
| Draw attention | Callouts (`Note`, `Warning`, `Info`, `Tip`, `Check`, `Danger`), `Banner`, `Badge`, `Update`, `Frame`, `Tooltip` |
| AI prompts | `Prompt` |
| Show and hide content | `Accordion`, `AccordionGroup`, `Expandable`, `View`, `Visibility` |
| API docs | `ParamField` / `ParamFields`, `ResponseField` / response fields, `RequestExample`, `ResponseExample` |
| Navigation and linking | `Card`, `Tiles` |
| Visual context | `Icon`, `Mermaid`, `Color`, `Tree`, media embeds |
| Custom interaction | Custom React only after built-ins fail the requirement |

## Decision Guide By Information Shape

| Information Shape | Prefer | Decision Rule |
| --- | --- | --- |
| Ordered workflow state | `Steps` | Use when sequence and progress matter. Keep required steps visible and verify `Step` nesting under `Steps`. |
| Language, SDK, framework, environment, request/response, or implementation alternatives | `Tabs` or `CodeGroup` | Use when alternatives are parallel. Watch tab/code-group sync behavior and open exact docs when labels, defaults, or sync behavior matter. |
| Secondary detail, optional explanation, troubleshooting, or long caveats | `Accordion`, `AccordionGroup`, `Expandable` | Use for progressive disclosure, not to hide required steps, warnings, API facts, or primary explanation. |
| Verified priority, risk, caveat, status, or update | Callouts, `Banner`, `Badge`, `Update`, `Frame`, `Tooltip` | Use attention components only when the priority/risk/status is verified. Do not create fake urgency or visual noise. |
| API parameters, fields, request examples, or response examples | `ParamField`, `ResponseField`, `RequestExample`, `ResponseExample` | Ground every field and example in source/OpenAPI/schema/runtime evidence. Manual API components must not drift from source truth. |
| Navigation to next actions or related pages | `Card`, `Tiles` | Use when links represent meaningful next steps or related paths. Prefer ordinary links for inline references. |
| Human-vs-agent visibility | `Visibility` | Use only when audience-specific content materially improves output. Always open Visibility and Markdown export docs before editing. |
| Context-specific rendering | `View` | Use only when context-dependent presentation is necessary and the fallback still preserves essential content. |
| Visual or structural context | `Icon`, `Mermaid`, `Color`, `Tree`, media embeds | Use when the visual form carries information. Ensure equivalent context remains available for accessibility and AI surfaces. |
| Client-side interaction not covered by built-ins | Custom React | Use only when built-ins cannot express a necessary interactive or reusable experience and the task justifies maintenance, accessibility, SEO, Markdown export, and performance cost. |

## Official URL Opening Rules

Open the exact official URL before:

- adding or changing an unfamiliar component;
- relying on exact props, nesting, sync behavior, anchors, TOC behavior, Markdown export behavior, API playground behavior, or custom React behavior;
- adding or changing `Visibility`, `View`, custom React, API field/example components, SDK examples, Mermaid, or snippets/imports;
- resolving conflict between local guidance, official docs, and observed behavior.

When a component affects a link target or anchor, also open Linking. When it affects code examples, also open Format code. When it affects media or diagrams, also open Images and embeds and Accessibility.

## Show/Hide And Markdown Export Risks

Treat show/hide components as progressive disclosure, not a place to bury essential content.

Do not hide required steps, warnings, API facts, or primary explanations inside collapsed, conditional, tabbed, or interactive content unless the alternate surface still carries the necessary content.

For AI-critical content, confirm it remains available in Markdown export or use `Visibility` intentionally.

`Visibility` intentionally changes web vs Markdown output; exact behavior belongs to Visibility and Markdown export docs. Use `Visibility` only when audience-specific content materially improves the output. Always open https://www.mintlify.com/docs/components/visibility and https://www.mintlify.com/docs/ai/markdown-export when adding, changing, or relying on `Visibility` behavior.

Use `View` only when context-dependent presentation is necessary and the fallback preserves essential content. If the reader or AI needs all variants at once, use ordinary headings, tables, tabs, or code groups instead.

## API Component Rules

Treat API components as fact-rendering tools grounded in OpenAPI/schema/source truth, not freehand API invention surfaces.

Manual API components must not drift from OpenAPI/source truth. Examples must be executable, copied from a verified source, or structurally faithful to the real API.

API component work also requires [authoring-contract.md](authoring-contract.md). Manual MDX API frontmatter and SDK examples require their exact official URLs:

- Manual API pages: https://www.mintlify.com/docs/api-playground/mdx-setup
- Add SDK examples: https://www.mintlify.com/docs/api-playground/adding-sdk-examples

Hand off OpenAPI wiring, generated endpoint navigation, `docs.json`, and page registration to the configuration skill.

## Custom React Criteria

Prefer built-in Mintlify components before custom React.

Create custom React only when built-ins cannot express a necessary interactive or reusable experience and the task justifies added maintenance, accessibility, SEO, Markdown export, and performance cost.

Do not create custom React for decoration, simple layout, callouts, nav cards, tabbed examples, status badges, diagrams, or API field rendering when built-ins cover the need.

Read https://www.mintlify.com/docs/customize/react-components before custom React work. Read https://www.mintlify.com/docs/create/reusable-snippets when custom component files or imports are involved.

Account for client-side rendering, keyboard accessibility, screen readers, SEO, performance, responsive behavior, Markdown export, and fallback meaning.

Hand off to verification for rendered preview smoke testing.

## Pinned Behavior Evidence

These behavior notes are local risk guidance verified in the repo-pinned `mint` dependency. They are not a private API dependency and must not replace official docs. Use them to decide when to verify, inspect output, or open official docs.

- `remarkValidateSteps` warns when `<Step>` is not a direct child of `<Steps>`.
- `remarkValidateTabs` warns when `<Tab>` is not a direct child of `<Tabs>`.
- Markdown export processing removes `Visibility for="humans"` content and unwraps/keeps `Visibility for="agents"` content.
- Component ID behavior differs by component. In the pinned implementation, `Accordion`, `Tab`, `CodeBlock`, `Table`, optimized media, and `View` forward raw IDs; `Heading`, `Step`, and `Update` clean IDs; many containers do not pass IDs to DOM elements.
- `Tabs` can be split for alternate rendering, and `CodeGroup`, `RequestExample`, and `ResponseExample` can be split into child code blocks in Markdown-oriented processing.
- Snippet/import resolution exists and can be order-sensitive; do not treat custom components or imports as zero-risk.

## Component Failure Modes

- Decorative overuse: cards, callouts, badges, icons, and frames make pages busier without improving comprehension.
- Underuse: plain prose hides workflow state, alternatives, API structure, visibility differences, or navigation paths that a component would make clearer.
- Hidden essentials: accordions, tabs, `View`, `Visibility`, and custom interactive components can make content harder for readers or AI to access.
- Markdown export mismatch: `Visibility` intentionally changes web vs Markdown output; custom React may not produce useful Markdown.
- Invalid nesting: `Tab` must be under `Tabs`; `Step` must be under `Steps`.
- Anchor/ID surprises: many components do not pass `id` to DOM elements; do not assume component containers are link targets.
- API drift: manual API components can document fields, examples, defaults, or responses that diverge from OpenAPI/source truth.
- Custom component costs: client-side rendering can hurt SEO, load, accessibility, maintainability, and Markdown export.

## Verification Handoff Triggers

Hand off to the verification skill when component changes affect:

- rendered layout;
- interactive behavior;
- responsive behavior;
- accessibility-sensitive UI;
- `Visibility`, `View`, or Markdown export;
- API playground examples;
- custom React;
- images, videos, colors, Mermaid diagrams, or other visual content.

Report the verification need as a handoff. Do not turn this authoring skill into the verification execution layer.
