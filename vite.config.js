import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import viteSvgIcons from 'vite-plugin-svg-icons'

const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    ElementPlus(),
    viteSvgIcons({
      // 配置路径在你的src里的svg存放文件
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],

  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      '/ligness-img': {
        target: 'http://121.12.78.36:8888',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/ligness-img/, '')
      },
      '/ligness': {
        target: 'http://121.12.78.36:10001',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/ligness/, '')
      },
    }
  }
})
