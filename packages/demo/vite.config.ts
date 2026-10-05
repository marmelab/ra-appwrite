import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    return {
        plugins: [react()],
        resolve: {
            // use the sources, so that the demo reflects changes without a build
            alias: {
                'ra-appwrite': fileURLToPath(
                    new URL('../ra-appwrite/src', import.meta.url)
                ),
            },
        },
        server: {
            port: 8000,
            open: true,
        },
        base: './',
        esbuild: {
            keepNames: true,
        },
        build: {
            // sourcemap: true,
            rollupOptions: {
                plugins: [preserveDirectives()],
            },
        },
    };
});
