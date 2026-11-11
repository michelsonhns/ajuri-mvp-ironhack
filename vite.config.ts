import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { rollupOptions: { output: { manualChunks: { mui: ['@mui/material', '@emotion/react', '@emotion/styled'] } } } },
});
