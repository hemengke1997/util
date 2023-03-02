/// <reference types="vite/client" />

import { loadEnv, mergeConfig as viteMergeConfig } from 'vite'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { VPPTPluginOptions } from 'vite-plugin-public-typescript'
import { deepMerge } from '@minko-fe/lodash-pro'
import { injectEnv, pathsMapToAlias } from './utils'
import { svgr } from './plugins/svgr'
import { pt } from './plugins/publicTypescript'
import type { legacyOptions } from './plugins/legacy'
import { legacy } from './plugins/legacy'
import type { compressOptions } from './plugins/compress'
import { compress } from './plugins/compress'
import { visualizer } from './plugins/visualizer'

type pluginOptions = Partial<{
  compressOpts: compressOptions | false
  legacyOpts: legacyOptions | false
  publicTypescriptOpts: VPPTPluginOptions | false
}>

// https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
const esbuildTarget = ['es2015']

function setupPlugins(options?: pluginOptions) {
  const vitePlugins: PluginOption = [svgr(), visualizer()]

  const { compressOpts, legacyOpts, publicTypescriptOpts } = options || {}

  if (compressOpts !== false) {
    vitePlugins.push(compress(compressOpts))
  }

  if (legacyOpts !== false) {
    vitePlugins.push(legacy(legacyOpts))
  }

  if (publicTypescriptOpts !== false) {
    const defaultVpptOpts = { esbuildOptions: { target: esbuildTarget } }

    vitePlugins.push(pt(deepMerge(defaultVpptOpts, publicTypescriptOpts)))
  }

  return vitePlugins
}

const getDefaultConfig = ({ root }: { root: string }, options?: pluginOptions): UserConfig => {
  const alias = pathsMapToAlias(root)

  return {
    root,
    resolve: {
      alias,
    },
    plugins: setupPlugins(),
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
      target: options?.legacyOpts === false ? esbuildTarget : undefined,
      reportCompressedSize: false,
    },
  }
}

const overrideConfig = async (configEnv: ConfigEnv, userConfig: UserConfig, options?: pluginOptions) => {
  const { mode } = configEnv
  const root = userConfig.root || process.cwd()
  const config = viteMergeConfig(getDefaultConfig({ root }, options), userConfig)
  const env = loadEnv(mode, root) as ImportMetaEnv
  injectEnv(env)
  return config
}

export * from './utils/rollupOptions'
export { getDefaultConfig, overrideConfig, injectEnv }
