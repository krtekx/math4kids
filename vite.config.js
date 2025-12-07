import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // Ensures relative paths for assets in built files
    build: {
        outDir: 'dist',
    }
});
