// import { fileURLToPath, URL } from 'node:url'
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     AutoImport({
//       resolvers: [ElementPlusResolver()],
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()],
//     }),      
        
//   ],
  
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
//   server:{
//     proxy:{
//       '/api':{//获取路径中包含了/api的请求
//           target:'http://localhost:1024',//后台服务所在的源
//           changeOrigin:true,//修改源
//           rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
//       }
//     }
//   }
// })
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ];

  // 仅在生产构建时添加 visualizer 插件
 
  if (command === 'build' && mode === 'production') {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html',
      })
    );
  }
  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:1024',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
