# Folder structure

```
portfolio_yandex_map_clusters/
  package.json
  package-lock.json
  vite.config.ts        # root: frontend/, outDir: dist/, preact()
  tsconfig.json         # jsxImportSource: preact
  .env.example          # VITE_YANDEX_MAPS_API_KEY=
  frontend/             # Vite root
    index.html
    public/data/
      features.json     # ~12 mock points; coords [lat,lng] strings
    public/images/
      warehouse.svg     # placeholder photo for marker detail cards
    source/
      scripts/
        main.ts         # entry; fetch JSON; wire map + sidebar
        features/       # vanilla map core (ymap, map-marker, map-cluster, utils)
        blocks/         # Preact sidebar island only (map-sidebar.tsx)
        types/          # map-feature.d.ts (t_FeatureCollection, t_ClustererFeature)
      styles/
        main.scss       # imports base/ then blocks/
        base/           # variables.scss (--space-control-*, --radius-control, --color-border)
        blocks/         # one SCSS file per BEM block
                        # button (shared control chrome), catalogue-page, map, map-marker,
                        # map-cluster, map-sidebar
  documentation/        # tracked human docs
  dist/                 # build output (gitignored)
```

Vite treats `frontend/` as the app root. Production assets land in repo-root `dist/`.

Page shell: `.catalogue-page` owns header + `__layout` (`.catalogue-page__sidebar` slot + `.map`). View modifiers `--map-view` / `--list-view` toggle `.map--visible`.

Shared controls: view toggles and filter chips compose `.button` (+ modifiers). Style rules live in `.prompts/base/how_to_visualise.md`. Map markers/clusters stay map DOM — not `.button`.
