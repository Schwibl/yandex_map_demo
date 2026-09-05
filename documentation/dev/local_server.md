# Local dev

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port **5175**) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally (port 5175) |

```bash
cp .env.example .env
# Add VITE_YANDEX_MAPS_API_KEY (or use .env.local)
npm install
npm run dev
```

Open http://localhost:5175

## Env

Vite loads env from the **repo root** (`envDir` in `vite.config.ts`, next to this config — not from `frontend/`).

| File | Tracked? | Purpose |
|------|----------|---------|
| `.env.example` | yes | Empty template only |
| `.env` / `.env.local` | no | Real `VITE_YANDEX_MAPS_API_KEY` |

Restart the dev server after any env change.

Without a key, the map area shows a placeholder; sidebar and mock JSON still work.

Get a key from the [Yandex developer console](https://developer.tech.yandex.com/). Allow `localhost` in key restrictions.

## Layout

- Vite `root`: `frontend/`
- Entry: `frontend/source/scripts/main.ts` (imports SCSS)
- Mock data: `frontend/public/data/features.json`
- Output: repo-root `dist/`
- Preact: `@preact/preset-vite` — sidebar island only (`blocks/map-sidebar.tsx`)
