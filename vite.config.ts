import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {

  // Load variables from .env file based on the current mode

  const env = loadEnv(mode, process.cwd(), '')

  // Grab the backend IP directly from the new .env variable.

  // Fallback to localhost if it's missing.

  const backendTarget = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

  return {

    plugins: [

      vue(),

      vueDevTools(),

    ],

    server: {

      host: '0.0.0.0',

      port: 5173,

      proxy: {

        '/api': {

          target: backendTarget,

          changeOrigin: true,

        },

      },

    },

    resolve: {

      alias: {

        '@': fileURLToPath(new URL('./src', import.meta.url))

      },

    },

  }

})