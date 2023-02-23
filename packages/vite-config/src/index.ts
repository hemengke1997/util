/// <reference types="vite/client" />

import { loadEnv, mergeConfig as viteMergeConfig } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { injectEnv, pathsMapToAlias } from './utils'

const getDefaultConfig = ({ root }: { root: string }): UserConfig => {
  const alias = pathsMapToAlias(root)
  return {
    root,
    resolve: {
      alias,
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[local]-[hash:base64:5]',
      },
    },
    server: {},
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 2048,
      sourcemap: false,
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

export { getDefaultConfig, overrideConfig, injectEnv }
