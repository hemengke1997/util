import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { injectEnv, setupPlugins } from './utils'

const viteConfig = defineConfig(async ({ command, mode, ssrBuild }) => {
  const root = process.cwd()

  const __APP_INFO__ = {
    lastBuildTime: new Date().toLocaleString(),
  }

  // const _isBuild = command === 'build'

  const env = loadEnv(mode, root) as ImportMetaEnv

  injectEnv(env)

  return {
    base: '/',
    root,
    mode,
    plugins: await setupPlugins(),
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[local]-[hash:base64:5]',
      },
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 2048,
      sourcemap: false,
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})

export { viteConfig }
