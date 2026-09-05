# Architecture

```
main.ts
  ├── fetch features.json
  ├── map-sidebar.tsx (Preact) — filters + list
  └── ymap.ts (vanilla)
        ├── load Yandex CDN script
        ├── YMapClusterer + custom DOM
        └── window.updateMap()
```

Vanilla owns map lifecycle. Preact owns sidebar UI. They sync via shared in-memory state in main.ts.
