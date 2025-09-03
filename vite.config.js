import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: '/oj-certificate/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/onlinejudge3/api': {
        target: 'https://oj.sdutacm.cn',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename) {
      let cdnUrl = process.env.CDN_URL || '/oj-certificate';
      if (!cdnUrl.endsWith('/')) {
        cdnUrl += '/';
      }
      return `${cdnUrl}${filename}`;
    },
  },

})
