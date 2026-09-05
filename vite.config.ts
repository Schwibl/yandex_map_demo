import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// Vite — frontend/ is the app root; Preact preset for sidebar .tsx; Sass via `sass` package
export default defineConfig({
  root: 'frontend',
  // .env lives next to this config (repo root), not under frontend/
  envDir: path.resolve(__dirname),
  plugins: [preact()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5175,
  },
  preview: {
    port: 5175,
  },
});
