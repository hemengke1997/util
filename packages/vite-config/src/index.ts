/// <reference types="vite/client" />

import { loadEnv, mergeConfig as viteMergeConfig } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { injectEnv, pathsMapToAlias } from './utils'
import { svgr } from './plugins/svgr'
import { pt } from './plugins/publicTypescript'
import { legacy } from './plugins/legacy'

const getDefaultConfig = ({ root }: { root: string }): UserConfig => {
  const alias = pathsMapToAlias(root)

  // https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
  const esbuildTarget = ['es2015']

  return {
    root,
    resolve: {
      alias,
    },
    plugins: [svgr(), pt({ esbuildOptions: { target: esbuildTarget } }), legacy()],
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[local]-[hash:base64:5]',
      },
    },
    define: {
      'process.env': process.env,
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 2048,
      sourcemap: false,
      target: esbuildTarget,
      reportCompressedSize: false,
    },
  }
}

const overrideConfig = async (configEnv: ConfigEnv, userConfig: UserConfig) => {
  const { mode } = configEnv
  const root = userConfig.root || process.cwd()
  const config = viteMergeConfig(getDefaultConfig({ root }), userConfig)
  const env = loadEnv(mode, root) as ImportMetaEnv
  injectEnv(env)
  return config
}

export * from './utils/rollupOptions'
export * from './utils/env'
export { getDefaultConfig, overrideConfig, injectEnv }
