# How to git

These are part of done and are never cut (see Precedence in `AGENTS.md`).

## Branches

Never commit to `main`. Branch from up-to-date `main`, push, open a PR. `main` is protected: CI must pass before merge. Nobody pushes to `main` directly.

Branches are short-lived and named by type:

- `feat/<topic>`: new feature
- `fix/<topic>`: bug fix
- `chore/<topic>`: tooling, deps, housekeeping
- `ci/<topic>`: CI/CD pipelines
- `docs/<topic>`: documentation only
- `cursor/<topic>`: cloud-agent work (same PR rules as the types above)

Every branch goes through a PR into `main`. CI checks plus the Vercel preview URL are the review and demo stand; there is no `develop` branch. `main` is production.

## Commit messages

```text
[area] <Past-tense verb> <what landed>
```

Examples: `[auth] Added session refresh on 401`, `[ci] Cached Playwright browsers`. No `wip`, `update`, `fix`, or present tense.

Keep commits small and focused: one change per commit.

## Pull requests

- One logical change per PR. Base: `main`.
- Merge with squash. Do not merge the feature branch with a merge commit, and do not push commits straight to `main`.
- Description: what changed, why, how it was checked, what was skipped.
- The auditor reviews before merge (`agents/auditor.md`). Not done until the PR exists and CI is green.
