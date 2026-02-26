#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code on the web sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# ── Node.js / npm ────────────────────────────────────────────────────────────
if [ -f "package.json" ]; then
  echo "Installing Node.js dependencies..."
  npm install
fi

# ── Python (pip) ─────────────────────────────────────────────────────────────
if [ -f "requirements.txt" ]; then
  echo "Installing Python dependencies (pip)..."
  pip install -r requirements.txt
fi

# ── Python (Poetry) ──────────────────────────────────────────────────────────
if [ -f "pyproject.toml" ] && command -v poetry &>/dev/null; then
  echo "Installing Python dependencies (poetry)..."
  poetry install --no-interaction
elif [ -f "pyproject.toml" ]; then
  echo "Installing Python dependencies (pip)..."
  pip install -e . 2>/dev/null || pip install . 2>/dev/null || true
fi

# ── Ruby / Bundler ────────────────────────────────────────────────────────────
if [ -f "Gemfile" ]; then
  echo "Installing Ruby dependencies..."
  bundle install
fi

# ── Rust / Cargo ─────────────────────────────────────────────────────────────
if [ -f "Cargo.toml" ]; then
  echo "Fetching Rust dependencies..."
  cargo fetch
fi

# ── Go ───────────────────────────────────────────────────────────────────────
if [ -f "go.mod" ]; then
  echo "Downloading Go dependencies..."
  go mod download
fi

echo "Session start hook completed."
