# Yandex map clusters demo

Custom DOM markers and grid clustering on Yandex Maps v3. Vanilla TS for the map; Preact for the filter sidebar.

## Setup

```bash
cp .env.example .env
# Add your Yandex Maps API key to .env
npm install
npm run dev
```

Open http://localhost:5175

Get a key from the [Yandex developer console](https://developer.tech.yandex.com/). Allow `localhost` in the key restrictions.

Without a key, the map area shows a placeholder message. The sidebar and mock JSON still work.

## Features

- `@yandex/ymaps3-clusterer` grid clustering
- Custom marker and cluster DOM
- `updateMap()` refits bounds when filters change
- Preact sidebar for district filters and selection

Portfolio extract of commercial catalogue map work (generic mock data, no client branding).

## Stack

TypeScript, Vite, Preact (sidebar only), SCSS (BEM).
