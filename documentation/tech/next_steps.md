# Next steps

- 2026-09-05 — Controls design update (steps 1–6): shared `.button` + `--space-control-*`; catalogue view toggles and sidebar chips/rows migrated. No leftover feature-owned `__view-button` / `__chip` control chrome. Map cluster `999px` radius is map DOM, not a form control — leave alone.
- 2026-09-05 — Fixed: with `root: 'frontend'`, Vite defaulted `envDir` to `frontend/`; set `envDir` to repo root so `.env` is found.
- 2026-09-01 — No PHP filter backend; client-side district filter only.
