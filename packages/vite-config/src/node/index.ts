/// <reference types="vite/client" />

import { loadEnv, splitVendorChunkPlugin, mergeConfig as viteMergeConfig } from 'vite'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { VPPTPluginOptions } from 'vite-plugin-public-typescript'
import { injectEnv, pathsMapToAlias } from './utils'
import { svgr } from './plugins/svgr'
import type { legacyOptions } from './plugins/legacy'
import type { compressOptions } from './plugins/compress'
import { visualizer as visualizerPlugin } from './plugins/visualizer'

interface pluginOptions {
  /**
   * @default
   * { compress: 'gzip', deleteOriginFile: false }
   */
  compress?: compressOptions | false
  /**
   * @default
   * { renderLegacyChunks: true, polyfills: true, ignoreBrowserslistConfig: false }
   */
  legacy?: legacyOptions | false
  /**
   * @default
   * { esbuildOptions: { target: ['es2015'] } }
   */
  publicTypescript?: VPPTPluginOptions | false
  /**
   * @default
   * true
   */
  splitVendorChunk?: boolean
}

// https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
const esbuildTarget = ['es2015']

async function setupPlugins(options: pluginOptions) {
  const vitePlugins: PluginOption = [svgr(), visualizerPlugin()]

  const { compress, legacy, publicTypescript, splitVendorChunk } = options

  if (splitVendorChunk !== false) {
    vitePlugins.push(splitVendorChunkPlugin())
  }

  if (compress !== false) {
    const { compress: compressPlugin } = await import('./plugins/compress')
    vitePlugins.push(compressPlugin(compress))
  }

  if (legacy !== false) {
    const { legacy: legacyPlugin } = await import('./plugins/legacy')
    vitePlugins.push(legacyPlugin(legacy))
  }

  if (publicTypescript !== false) {
    const defaultVpptOpts = { esbuildOptions: { target: esbuildTarget } }
    const { pt } = await import('./plugins/publicTypescript')
    const { deepMerge } = await import('@minko-fe/lodash-pro')
    vitePlugins.push(pt(deepMerge(defaultVpptOpts, publicTypescript || {})))
  }

  return vitePlugins
}

const getDefaultConfig = async ({ root }: { root: string }, options?: pluginOptions): Promise<UserConfig> => {
  const alias = pathsMapToAlias(root)

  return {
    root,
    resolve: {
      alias,
    },
    plugins: await setupPlugins(options || {}),
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
      target: options?.legacy === false ? esbuildTarget : undefined,
      reportCompressedSize: false,
      rollupOptions: {
        treeshake: true,
      },
    },
  }
}

const overrideConfig = async (configEnv: ConfigEnv, userConfig: UserConfig, options?: pluginOptions) => {
  const { mode } = configEnv
  const root = userConfig.root || process.cwd()
  const config = viteMergeConfig(await getDefaultConfig({ root }, options), userConfig)
  const env = loadEnv(mode, root) as ImportMetaEnv
  injectEnv(env)
  return config
}

export * from './utils/rollupOptions'
export { getDefaultConfig, overrideConfig, injectEnv }
