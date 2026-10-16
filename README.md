# Yandex map clusters

[![PR checks](https://github.com/Schwibl/yandex_map_demo/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/Schwibl/yandex_map_demo/actions/workflows/pr-checks.yml)

Custom DOM markers and grid clustering on Yandex Maps v3. The map core is vanilla TypeScript; the filter sidebar is Preact. Data is generic mock JSON.

**Live:** https://yandex-map-demo.vercel.app

## Stack
TypeScript 5.6, Vite 6, Preact 10.26 (sidebar only), @yandex/ymaps3-types, SCSS (BEM), Playwright 1.64 for e2e.

## Run
```bash
cp .env.example .env   # set VITE_YANDEX_MAPS_API_KEY
npm install
npm run dev            # http://localhost:5175
```
`VITE_YANDEX_MAPS_API_KEY` is a Yandex Maps JS API key from the [developer console](https://developer.tech.yandex.com/), restricted to your hosts. Never commit it. Without a key the map pane shows “Map is unavailable right now” and a Show list button; the env hint is only in the console. On a phone that state opens the list first, and Map/List shows one pane at a time. Restart Vite after changing `.env`.

```bash
npm run typecheck
npm run build      # typecheck + bundle to dist/
npm run preview
npm run e2e        # Playwright
```

More in [documentation/](documentation/README.md).
