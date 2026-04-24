# Install Mintlify Agent Kit

Use this file when setting up the kit for a human teammate or when asking another agent to do it.

## 1. Install Node.js

The official Mintlify CLI requires Node.js `20.17.0` or newer.

Verify:

```bash
node --version
npm --version
```

## 2. Install The Adapter

Use the helper:

```bash
./install.sh codex
./install.sh cursor
./install.sh both
```

The helper installs package dependencies in the kit repository and stops if Node.js or npm is missing.

Install targets:

- Codex: `${CODEX_HOME:-$HOME/.codex}/skills`
- Cursor: `${CURSOR_PLUGIN_HOME:-$HOME/.cursor/plugins/local}/mintlify-agent-kit`

## 3. Configure Kit Home When Needed

Skills invoke `mint` with:

```bash
npm --prefix "$MINTLIFY_AGENT_KIT_HOME" exec -- mint <command> ...
```

Set `MINTLIFY_AGENT_KIT_HOME` to the local kit clone when skills are installed outside the repository:

```bash
export MINTLIFY_AGENT_KIT_HOME="$HOME/.mintlify-agent-kit"
```

Cursor plugin installs include their own package files and dependencies, so Cursor can also use:

```bash
export MINTLIFY_AGENT_KIT_HOME="${CURSOR_PLUGIN_HOME:-$HOME/.cursor/plugins/local}/mintlify-agent-kit"
```

## 4. Restart The Agent

- Codex: start a new session
- Cursor: restart Cursor

## For Agents

```text
Set up the Mintlify Agent Kit from https://github.com/mulligan-madness/mintlify-agent-kit on this machine.

Important distinction:
- The official dependency is the Mintlify CLI package, `mint`.
- This repository is the Mintlify Agent Kit.
- Do not install `mint` globally unless the user explicitly asks for that separate setup.

Required process:
1. Read these docs first:
   - https://raw.githubusercontent.com/mulligan-madness/mintlify-agent-kit/main/README.md
   - https://raw.githubusercontent.com/mulligan-madness/mintlify-agent-kit/main/INSTALL.md
2. Run `node --version` and confirm Node.js is 20.17.0 or newer.
3. Run `npm --version`.
4. Ask the user which adapter(s) to install: `codex`, `cursor`, or `both`.
5. Clone `https://github.com/mulligan-madness/mintlify-agent-kit.git` if the repo is not already present locally, then run `./install.sh codex`, `./install.sh cursor`, or `./install.sh both` from the repo root.
6. Verify with `npm run doctor`.
7. Verify the installed files exist in the documented target location(s).
8. Report the exact result and any restart step required.
```
