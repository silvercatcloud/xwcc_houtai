import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const __dirname = path.dirname(new URL(import.meta.url).pathname)

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  server:{
    proxy:{
      '/api':{//获取路径中包含了/api的请求
          target:'http://localhost:1024',//后台服务所在的源
          changeOrigin:true,//修改源
          rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
      }
    }
  }
})