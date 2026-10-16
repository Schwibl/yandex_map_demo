# CI

GitHub Actions runs `.github/workflows/pr-checks.yml` (workflow name **PR checks**) on every pull request and on every push to `main`. A new push to the same ref cancels the run that is already going.

Branch protection matches these **job names** exactly:

1. `Install, typecheck, build`
2. `Playwright smoke`

GitHub registers those strings as the status check names. Require `Install, typecheck, build` and `Playwright smoke` before a squash-merge to `main`.

## What each job does

Both jobs read Node from `.nvmrc` (currently 24), cache npm dependencies from `package-lock.json`, and install with `npm ci` so the lockfile cannot drift.

**Install, typecheck, build**

- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — typecheck again, then `vite build` into `dist/`

There is no ESLint config, so this job does not lint. There is no unit-test script, so it does not run unit tests. The job name stays `Install, typecheck, build` until both of those exist. If they are added later, rename the job to `Install, lint, typecheck, test, build` and update branch protection to the new name.

**Playwright smoke**

- Installs Chromium
- `npm run build` with no `VITE_YANDEX_MAPS_API_KEY` in the environment
- `npm run e2e` — Playwright starts `vite preview` on `127.0.0.1:5175` and smokes the page: the app loads, the main UI renders (title, Map/List toggles, catalogue), and with no key the map pane shows **Map is unavailable right now** instead of crashing. The same file checks the phone list-first layout, chip labels, the result count, and the social meta tags.

A failed smoke run uploads the `playwright-report` artifact.

## Why the key is absent

The map key is a browser env var, `VITE_YANDEX_MAPS_API_KEY`. Vite inlines it at build time. CI never sets it, which is the point: the production build must succeed, and the page must show the missing-key state. The live Vercel demo sets the same variable in project settings. Restrict the Yandex key by HTTP referrer to that Vercel domain.

## Local equivalents

```bash
npm ci
npm run typecheck
npm run build
npm run e2e
```
