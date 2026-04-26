#!/bin/zsh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
CODEX_DEST_ROOT="${CODEX_HOME_DIR}/skills"
CURSOR_PLUGIN_ROOT="${CURSOR_PLUGIN_HOME:-$HOME/.cursor/plugins/local}"
CURSOR_DEST_ROOT="${CURSOR_PLUGIN_ROOT}/mintlify-agent-kit"
FACTORY_HOME_DIR="${FACTORY_HOME:-$HOME/.factory}"
FACTORY_DEST_ROOT="${FACTORY_HOME_DIR}/skills"
MIN_NODE_VERSION="20.17.0"
DEFAULT_KIT_HOME="${MINTLIFY_AGENT_KIT_HOME:-$HOME/.mintlify-agent-kit}"

print_usage() {
  cat <<'EOF'
Usage:
  ./install.sh codex
  ./install.sh cursor
  ./install.sh factory
  ./install.sh both
  ./install.sh all

This helper installs the Mintlify Agent Kit adapters and the repo-local
official Mintlify CLI dependency (`mint`).

Targets:
  codex   Install Codex skills.
  cursor  Install the Cursor plugin.
  factory Install Factory/Droid skills.
  both    Install Codex skills and the Cursor plugin.
  all     Install Codex, Cursor, and Factory/Droid adapters.
EOF
}

print_node_help() {
  cat <<EOF
Node.js ${MIN_NODE_VERSION}+ is required by the official Mintlify CLI.

Install or switch Node, then verify with:

  node --version
EOF
}

require_node() {
  if ! command -v node >/dev/null 2>&1; then
    print_node_help
    exit 1
  fi

  node -e '
    const min = process.argv[1].split(".").map(Number);
    const actual = process.versions.node.split(".").map(Number);
    for (let i = 0; i < Math.max(actual.length, min.length); i += 1) {
      const left = actual[i] || 0;
      const right = min[i] || 0;
      if (left > right) process.exit(0);
      if (left < right) process.exit(1);
    }
  ' "$MIN_NODE_VERSION" || {
    print_node_help
    exit 1
  }
}

require_npm() {
  if ! command -v npm >/dev/null 2>&1; then
    cat <<'EOF'
npm is required to install the repo-local official Mintlify CLI dependency.

Install npm with Node.js, then verify with:

  npm --version
EOF
    exit 1
  fi
}

install_dependencies() {
  local install_root="$1"

  if [[ -f "$install_root/package-lock.json" ]]; then
    if ! npm --prefix "$install_root" ci; then
      npm --prefix "$install_root" install
    fi
  else
    npm --prefix "$install_root" install
  fi
}

verify_mint() {
  local install_root="$1"

  DO_NOT_TRACK=1 MINTLIFY_TELEMETRY_DISABLED=1 npm --prefix "$install_root" exec -- mint --version >/dev/null
}

ensure_default_kit_home() {
  if [[ -n "${MINTLIFY_AGENT_KIT_HOME:-}" ]]; then
    echo "Using MINTLIFY_AGENT_KIT_HOME=$MINTLIFY_AGENT_KIT_HOME"
    return
  fi

  if [[ -L "$DEFAULT_KIT_HOME" ]]; then
    local resolved
    if resolved="$(cd "$DEFAULT_KIT_HOME" 2>/dev/null && pwd -P)"; then
      if [[ "$resolved" == "$REPO_ROOT" ]]; then
        echo "Default kit home already points to $REPO_ROOT"
      else
        cat <<EOF
Warning: $DEFAULT_KIT_HOME already points to $resolved.
Set this in Codex or Factory sessions that use this install:

  export MINTLIFY_AGENT_KIT_HOME="$REPO_ROOT"
EOF
      fi
    else
      cat <<EOF
Warning: $DEFAULT_KIT_HOME is a symlink that could not be resolved.
Set this in Codex or Factory sessions that use this install:

  export MINTLIFY_AGENT_KIT_HOME="$REPO_ROOT"
EOF
    fi
    return
  fi

  if [[ -e "$DEFAULT_KIT_HOME" ]]; then
    if [[ -d "$DEFAULT_KIT_HOME" ]]; then
      local existing
      existing="$(cd "$DEFAULT_KIT_HOME" && pwd -P)"
      if [[ "$existing" == "$REPO_ROOT" ]]; then
        echo "Default kit home already resolves to $REPO_ROOT"
        return
      fi
    fi
    cat <<EOF
Warning: $DEFAULT_KIT_HOME already exists and was not changed.
Set this in Codex or Factory sessions that use this install:

  export MINTLIFY_AGENT_KIT_HOME="$REPO_ROOT"
EOF
    return
  fi

  ln -s "$REPO_ROOT" "$DEFAULT_KIT_HOME"
  echo "Linked default kit home $DEFAULT_KIT_HOME -> $REPO_ROOT"
}

install_codex() {
  mkdir -p "$CODEX_DEST_ROOT"

  for skill_dir in "$REPO_ROOT"/skills/*; do
    if [[ ! -d "$skill_dir" ]]; then
      continue
    fi

    skill_name="$(basename "$skill_dir")"
    dest_dir="$CODEX_DEST_ROOT/$skill_name"
    rm -rf "$dest_dir"
    cp -R "$skill_dir" "$dest_dir"
    echo "Installed Codex skill $skill_name -> $dest_dir"
  done
}

install_factory() {
  mkdir -p "$FACTORY_DEST_ROOT"

  for skill_dir in "$REPO_ROOT"/skills/*; do
    if [[ ! -d "$skill_dir" ]]; then
      continue
    fi

    skill_name="$(basename "$skill_dir")"
    dest_dir="$FACTORY_DEST_ROOT/$skill_name"
    rm -rf "$dest_dir"
    cp -R "$skill_dir" "$dest_dir"
    echo "Installed Factory skill $skill_name -> $dest_dir"
  done
}

install_cursor() {
  mkdir -p "$CURSOR_PLUGIN_ROOT"
  rm -rf "$CURSOR_DEST_ROOT"
  mkdir -p "$CURSOR_DEST_ROOT"

  cp -R "$REPO_ROOT/.cursor-plugin" "$CURSOR_DEST_ROOT/.cursor-plugin"
  cp -R "$REPO_ROOT/skills" "$CURSOR_DEST_ROOT/skills"
  cp -R "$REPO_ROOT/scripts" "$CURSOR_DEST_ROOT/scripts"
  cp "$REPO_ROOT/package.json" "$CURSOR_DEST_ROOT/package.json"
  if [[ -f "$REPO_ROOT/package-lock.json" ]]; then
    cp "$REPO_ROOT/package-lock.json" "$CURSOR_DEST_ROOT/package-lock.json"
  fi
  if [[ -d "$REPO_ROOT/commands" ]]; then
    cp -R "$REPO_ROOT/commands" "$CURSOR_DEST_ROOT/commands"
  fi

  install_dependencies "$CURSOR_DEST_ROOT"
  verify_mint "$CURSOR_DEST_ROOT"

  echo "Installed Cursor plugin -> $CURSOR_DEST_ROOT"
}

main() {
  local target="${1:-}"

  case "$target" in
    codex|cursor|factory|both|all) ;;
    *)
      print_usage
      exit 1
      ;;
  esac

  require_node
  require_npm
  install_dependencies "$REPO_ROOT"
  verify_mint "$REPO_ROOT"

  case "$target" in
    codex)
      install_codex
      ensure_default_kit_home
      ;;
    cursor)
      install_cursor
      ;;
    factory)
      install_factory
      ensure_default_kit_home
      ;;
    both)
      install_codex
      ensure_default_kit_home
      install_cursor
      ;;
    all)
      install_codex
      install_factory
      ensure_default_kit_home
      install_cursor
      ;;
  esac

  echo
  echo "Mintlify Agent Kit install complete."
  echo "Codex restart: start a new session."
  echo "Cursor restart: restart Cursor."
  echo "Factory/Droid restart: restart Droid."
}

main "$@"
