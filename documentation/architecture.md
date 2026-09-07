# Architecture

```
main.ts
  ├── fetch /data/features.json
  ├── catalogue-page shell (--map-view / --list-view)
  ├── blocks/map-sidebar.tsx (Preact) — filters + list + card
  └── features/ymap.ts (vanilla)
        ├── load Yandex CDN script (VITE_YANDEX_MAPS_API_KEY)
        ├── YMap + scheme / source / markers layers
        ├── YMapClusterer (gridSize 64) + map-marker / map-cluster DOM
        │     ├── marker: hollow ring → hover basic → click detail (image + props) + sidebar
        │     └── cluster: one-line badge → hover member list (click zooms to member) → click fit bounds
        └── window.updateMap() → clusterer.update + fit bounds
```

Vanilla owns map lifecycle. Preact owns sidebar UI. They sync via shared state in `main.ts` and `updateMapFeatures()`.

Interactive chrome (Map/List toggles, district chips, list rows) composes shared `.button` from `styles/blocks/button.scss`. Markers/clusters remain map DOM factories (hover/detail popups are child DOM, not Yandex balloons).

Coordinate rule: JSON stores `[lat, lng]` strings; ymaps3 needs `[lng, lat]` numbers (`feature-utils.convertCoordinates`).
