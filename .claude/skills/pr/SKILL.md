---
name: pr
description: Create a feature branch, run lint and format, commit all changes, push, and open a pull request
---

The user wants to ship their current changes as a pull request. $ARGUMENTS may contain a branch name or PR title hint — use it if provided, otherwise derive from the changes.

Follow these steps in order:

## Step 1 — Check current state

Run `git status` and `git diff` to understand what has changed. Note all modified and untracked files.

If there are no changes, tell the user and stop.

## Step 2 — Determine branch name

If the user provided a name in $ARGUMENTS, use it (convert to kebab-case, prefix with `feature/` if not already prefixed).

Otherwise, derive a short kebab-case branch name from the changed files or nature of the work (e.g. `feature/add-dropdown-page`, `fix/iframe-timing`).

Check if we are already on a feature branch (not master/main). If yes, use it. If on master, create a new branch:

```
git checkout -b <branch-name>
```

## Step 3 — Lint and format

Run in order:

1. `npm run lint` — stop and report errors if it fails
2. `npm run format` — auto-fix formatting

If lint fails, tell the user what to fix before proceeding.

## Step 4 — Stage and commit

Stage all relevant changed files (be specific — do not use `git add .` blindly, exclude `.env`, `.claude/settings.local.json`).

Review `git log --oneline -5` to match the existing commit message style.

Write a concise conventional commit message:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `chore:` for config/tooling

Always append:

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Step 5 — Push

```
git push -u origin <branch-name>
```

## Step 6 — Open PR

Since the `gh` CLI is not installed, output the GitHub URL the user can open to create the PR:

```
https://github.com/horuktaras/claude-playwright-firststeps/compare/<branch-name>?expand=1
```

Also provide a ready-to-paste PR description with:

- **Summary** (2–3 bullet points of what changed)
- **Test plan** (checklist of what was verified)
