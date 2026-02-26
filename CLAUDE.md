# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

- **Repository**: Usogui7/Work-1
- **Remote**: `http://local_proxy@127.0.0.1:28768/git/Usogui7/Work-1`
- **Status**: Newly initialized repository — no source files committed yet.

> Update this section once the project has been bootstrapped with its language, framework, and purpose.

## Git Workflow

### Branch Naming

Development branches for Claude sessions follow this convention:

```
claude/<short-description>-<session-id>
```

Example: `claude/add-claude-documentation-bXqGK`

Always develop on the designated feature branch. Never push directly to `main`/`master` without explicit permission.

### Commit Practices

- Write clear, descriptive commit messages in the imperative mood (e.g., "Add authentication module", not "Added" or "Adding").
- Keep commits focused and atomic — one logical change per commit.
- Avoid committing secrets, credentials, or `.env` files.

### Push Protocol

```bash
git push -u origin <branch-name>
```

If push fails due to a network error, retry with exponential backoff: 2 s → 4 s → 8 s → 16 s (up to 4 retries).

---

## Project Structure

> This section should be updated once source files are added.

```
Work-1/
├── CLAUDE.md          # This file
└── (project files TBD)
```

---

## Development Setup

> Add environment setup instructions here (e.g., `npm install`, `pip install -e .`, `make setup`) once the project is bootstrapped.

---

## Build, Test, and Lint Commands

> Populate this section when build tooling is configured.

| Task  | Command |
|-------|---------|
| Build | TBD     |
| Test  | TBD     |
| Lint  | TBD     |
| Format | TBD   |

---

## Key Conventions

> Document language/framework conventions here as the project evolves (e.g., naming rules, file organization, import style, error handling patterns).

---

## CI/CD

> Add CI/CD pipeline details here once configured (GitHub Actions, GitLab CI, etc.).

---

## Notes for AI Assistants

1. **Read before writing** — always read existing files before editing them.
2. **Minimal changes** — only change what is directly requested or clearly necessary; avoid scope creep.
3. **No secrets** — never commit API keys, tokens, passwords, or `.env` files.
4. **Security first** — avoid introducing OWASP Top 10 vulnerabilities (SQLi, XSS, command injection, etc.).
5. **Ask when uncertain** — if requirements are ambiguous, ask the user before proceeding.
6. **Reversibility** — prefer reversible actions; confirm with the user before destructive operations (force-push, `rm -rf`, dropping tables, etc.).
7. **Update this file** — keep CLAUDE.md current whenever significant structural or workflow changes are made.
