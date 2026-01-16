
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {x
    target: 'esnext',
    outDir: 'dist'
  }
});
