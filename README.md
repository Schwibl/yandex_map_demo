# Yandex map clusters

Yandex Maps v3 custom markers and grid clustering — vanilla TypeScript map core with a Preact filter sidebar.

Portfolio extract of commercial catalogue-map patterns (generic mock data, no client branding).

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
2. Restrict the key to `localhost` (and your deploy host when you publish).
3. Set it in **repo-root** env (next to `vite.config.ts` — Vite `envDir`, not `frontend/`):

```bash
# .env  or  .env.local  (both gitignored)
VITE_YANDEX_MAPS_API_KEY=your_key_here
```

4. Restart Vite after changing env files (`import.meta.env` is fixed at server start).

Without a key, the map shows a placeholder; the sidebar and mock JSON still work.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 5175) |
| `npm run build` | Typecheck + `dist/` |
| `npm run preview` | Serve production build |

## What to look at

- `features/ymap.ts` — CDN load, layers, `YMapClusterer`, `window.updateMap`
- `features/map-marker.ts` / `map-cluster.ts` — custom DOM renderers
- `features/feature-utils.ts` — `[lat,lng]` → `[lng,lat]`, bounds
- `blocks/map-sidebar.tsx` — Preact filters calling `updateMap`

More detail: [`documentation/`](documentation/README.md).
