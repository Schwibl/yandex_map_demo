import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

export default defineConfig({
    root: 'frontend',
    plugins: [preact()],
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
  server: { port: 5175 },
});
