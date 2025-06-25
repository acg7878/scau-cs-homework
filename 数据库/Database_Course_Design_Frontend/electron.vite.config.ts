import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5555', // 后端服务地址
          changeOrigin: true, // 是否改变请求源
          rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
        }
      }
    }
  }
})
