# Yandex map clusters

[![PR checks](https://github.com/Schwibl/yandex_map_demo/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/Schwibl/yandex_map_demo/actions/workflows/pr-checks.yml)

Yandex Maps v3 custom markers and grid clustering — vanilla TypeScript map core with a Preact filter sidebar.

Portfolio extract of commercial catalogue-map patterns (generic mock data, no client branding).

## Live demo

https://<project>.vercel.app

The live demo needs `VITE_YANDEX_MAPS_API_KEY` set as a Vercel environment variable. Restrict the Yandex key by HTTP referrer to the Vercel domain. The app builds and runs without the key: the map area shows **Map API key not configured** instead of crashing.

## Quick start

```bash
cp .env.example .env
# Put your key in .env (or .env.local) — never commit it
npm install
npm run dev
```

Open http://localhost:5175

## Yandex API key

1. Create a key in the [Yandex developer console](https://developer.tech.yandex.com/).
2. Restrict the key by HTTP referrer to `localhost` and, for the live demo, to the Vercel domain.
3. Set it in **repo-root** env (next to `vite.config.ts` — Vite `envDir`, not `frontend/`):

```bash
# .env  or  .env.local  (both gitignored)
VITE_YANDEX_MAPS_API_KEY=your_key_here
```

4. Restart Vite after changing env files (`import.meta.env` is fixed at server start).

Without a key, the map area shows **Map API key not configured**; the sidebar and mock JSON still work.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 5175) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Typecheck + `dist/` |
| `npm run preview` | Serve production build |
| `npm run e2e` | Playwright smoke (needs a build; serves `dist/`) |

CI job names and what they run: [`docs/ci.md`](docs/ci.md).

## What to look at

- `features/ymap.ts` — CDN load, layers, `YMapClusterer`, `window.updateMap`
- `features/map-marker.ts` / `map-cluster.ts` — custom DOM renderers
- `features/feature-utils.ts` — `[lat,lng]` → `[lng,lat]`, bounds
- `blocks/map-sidebar.tsx` — Preact filters calling `updateMap`

More detail: [`documentation/`](documentation/README.md).
