import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    const isWorkerBuild = process.env.WORKER_BUILD === 'true';

    // Common configuration
    const baseConfig = {
        plugins: [
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                    compilerOptions: {
                        isCustomElement: (tag) => tag.startsWith('media-'),
                    },
                },
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './resources/js'),
                '@images': path.resolve(__dirname, './resources/images'),
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },
    };

    // Worker-specific configuration
    if (isWorkerBuild) {
        return {
            ...baseConfig,
            define: {
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
            },
            build: {
                ssr: 'resources/js/ssr-shared.ts',
                outDir: 'dist',
                rollupOptions: {
                    output: {
                        entryFileNames: 'ssr.js'
                    }
                }
            },
        };
    }

    // Traditional Laravel configuration
    return {
        ...baseConfig,
        plugins: [
            ...baseConfig.plugins,
            laravel({
                input: ['resources/js/app.ts'],
                ssr: 'resources/js/ssr.ts',
                refresh: true,
            }),
            tailwindcss(),
        ],
    };
});
