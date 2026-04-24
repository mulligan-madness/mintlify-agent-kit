# Agent Instructions

These instructions apply to this repository.

## Read Before Acting

Before answering questions about this codebase, architecture, design, or implementation, read the actual files first. Do not infer behavior from names, prior memory, or what seems likely.

When working from a Linear issue:

- Read the full issue description, current status, comments, parent issue, sibling issues, and attachments before planning or editing.
- Fetch and inspect image content when Linear descriptions or comments include images.
- Keep the current issue's scope distinct from sibling issue scope.
- Reference the Linear issue identifier in commits.

Before editing repository docs or skills, read the relevant existing files and official source material named by the issue. For Mintlify behavior, prefer official Mintlify docs and the repo-pinned official `mint` CLI over assumptions.

## Confidence And Determinism Discipline

For new skills or major skill changes, do not move from research to drafting just because the broad shape seems clear.

First, identify known unknowns and reduce them until the skill can use deterministic language.

- State current confidence and what keeps it below high confidence.
- Separate verified facts from assumptions.
- Turn vague phrases like "where relevant", "if useful", "representative", "may", or "should" into concrete criteria before implementation.
- If deterministic language is not possible, name the unresolved gap and encode a `blocked`, `skipped`, or out-of-scope rule instead of pretending it is solved.

Use experimentation to reduce known unknowns:

- Exercise every CLI command, flag, auth path, hosted surface, or file behavior the skill will instruct agents to use.
- Prefer temporary fixtures, public URLs, and approved authenticated targets.
- Compare docs, help text, and actual installed behavior; treat mismatches as findings.
- Clean up all temporary files, processes, and generated artifacts.

Mitigate unknown unknowns without expanding scope:

- Ask what evidence would falsify the current plan.
- Probe edge cases that could change the skill contract, such as auth failure, long-running commands, output size, ignored flags, stale hosted URLs, and local-vs-hosted behavior differences.
- Run spec-compliance and skill-quality reviews before completion.
- Use `superpowers:receiving-code-review` to evaluate review findings against the actual codebase before changing anything.

Only draft once the remaining uncertainty is resolved or explicitly represented as `blocked`, `skipped`, or out of scope.

## Research And Experimentation

Before drafting or changing a skill that tells agents to use a CLI surface, actually use that CLI surface.

- Exercise every command, flag, hosted surface, or auth path the skill will instruct agents to use.
- Use safe temporary fixtures, public URLs, or authenticated targets approved for the task.
- Clean up temporary directories, files, background processes, and generated artifacts.
- Do not leave filesystem traces from exploration.
- Do not rely only on docs or `--help`; docs, help text, and installed CLI behavior can diverge.
- Record behavior that affects the skill contract, especially exit codes, long-running processes, auth failures, output shape, and cases where a local check does not prove a hosted behavior.

Experience and experimentation are valid forms of learning when they are controlled, reversible, and verified.

## Scope Discipline

Keep each child issue inside its layer.

- Install/preflight work must not become root routing or verification guidance.
- Verification work must not become authoring, configuration, deployment, analytics, or install guidance.
- Authoring work must not become configuration or verification execution.
- Configuration work must not become prose-quality guidance or deployment operations.
- Root router work should route and define cross-cutting source-of-truth rules; it should not duplicate full child workflows.

The CNS-115 correction is the precedent: the first implementation crossed into root-router and verification scope and had to be narrowed. Package and plugin metadata may describe the installable Mintlify Agent Kit broadly, but individual skill bodies must stay narrow.

## Official Tooling Stance

Use the official `mint` CLI through the repo-local kit dependency. Do not require a global `mint` install.

Canonical automated invocation:

```bash
DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$KIT_HOME" exec -- mint <command> ...
```

Do not build custom wrapper CLIs around `mint` commands. Do not call private or direct `@mintlify/*` package APIs in v1 unless a future issue explicitly changes that boundary.

Do not read, print, or manipulate Mintlify credential values. Use `mint status`, `mint config get subdomain`, authenticated `mint score`, or doctor/preflight checks when account/project context is required.

## Verification And Evidence

Do not report success without fresh evidence.

- Run the relevant repository verification commands before completion.
- Report `passed`, `failed`, `blocked`, and `skipped` as distinct outcomes.
- Do not collapse "not applicable", "not run", and "passed".
- Include command, working directory, target URL when applicable, and concise evidence.
- If a check is blocked, say exactly why and what would unblock it.

For Mintlify docs work, local source checks, local preview smoke checks, and hosted AI-surface checks are different. Local preview does not prove hosted `/llms.txt`, `/llms-full.txt`, `.md` URLs, or `Accept` negotiation.

## Review Discipline

For new skills or major skill changes, run two review passes before completion:

1. Use `superpowers:requesting-code-review` for a spec-compliance review.
   - Compare the implementation against the Linear issue, plan, and stated scope.
   - Fix Critical and Important findings before completion, or push back with technical reasoning.
2. Use `superpowers:requesting-code-review` for a skill/code-quality review.
   - Evaluate discoverability, trigger clarity, deterministic workflow, resistance to misuse, boundary discipline, and whether a future agent could reliably use the skill.

For every review result, use `superpowers:receiving-code-review` before implementing feedback.

- Read the full feedback.
- Verify each finding against the actual codebase.
- Implement only technically sound feedback.
- Ask if any finding is unclear.
- Push back with technical reasoning when a finding is wrong or conflicts with issue scope.

## Completion Hygiene

Before marking Linear work complete:

- Verify the final diff only contains intended files.
- Run required tests and checks.
- Commit with the issue identifier in the message.
- Leave a Linear completion comment that references the commit, what changed, verification run, review performed, and lessons learned.
- Move the Linear issue to Done only after the commit, comment, and verification are complete.

Do not create branches, worktrees, commits, pull requests, or Linear status changes unless the user requested that step or the active workflow explicitly requires it.
