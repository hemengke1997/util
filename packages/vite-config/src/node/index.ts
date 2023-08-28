import { loadEnv, splitVendorChunkPlugin, mergeConfig as viteMergeConfig } from 'vite'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { VPPTPluginOptions } from 'vite-plugin-public-typescript'
import { deepMerge } from '@minko-fe/lodash-pro'
import createDebug from 'debug'
import { injectEnv, pathsMapToAlias } from './utils'
import type { LegacyOptions } from './plugins/legacy'
import type { CompressOptions } from './plugins/compress'
import { visualizer as visualizerPlugin } from './plugins/visualizer'

const debug = createDebug('vite-config')

interface PluginOptions {
  /**
   * @default true
   */
  svgr?: boolean
  /**
   * @default
   * { compress: 'gzip', deleteOriginFile: false }
   */
  compress?: CompressOptions | false
  /**
   * @default
   * { renderLegacyChunks: true, polyfills: true, ignoreBrowserslistConfig: false }
   */
  legacy?: LegacyOptions | false
  /**
   * @default
   * { esbuildOptions: { target: ['es2015'] } }
   */
  publicTypescript?: VPPTPluginOptions | false
  /**
   * @default
   * csr and not legacy render
   * @suggestion
   * disable if you want legacy render
   */
  splitVendorChunk?: boolean
  /**
   * @default true
   */
  logAppInfo?: boolean
}

// https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
const esbuildTarget = ['es2015']

const defaultOptions: PluginOptions = {
  svgr: true,
  compress: {
    compress: 'gzip',
    deleteOriginFile: false,
  },
  legacy: {
    renderLegacyChunks: true,
    polyfills: true,
    modernPolyfills: true,
    ignoreBrowserslistConfig: false,
  },
  publicTypescript: {
    esbuildOptions: { target: esbuildTarget },
  },
  splitVendorChunk: undefined,
  logAppInfo: true,
}

async function setupPlugins(options: PluginOptions, configEnv: ConfigEnv) {
  options = deepMerge(defaultOptions, options)

  debug('options:', options)

  const { ssrBuild } = configEnv

  const { svgr, compress, legacy, publicTypescript, splitVendorChunk, logAppInfo } = options

  const vitePlugins: PluginOption = [visualizerPlugin()]

  if (svgr !== false) {
    const { svgr: svgrPlugin } = await import('./plugins/svgr')
    vitePlugins.push(svgrPlugin())
  }

  if (splitVendorChunk !== false) {
    // splitVendorChunk brings inline css which make style order
    // and css weights wrong in legacy render
    // https://github.com/vitejs/vite/issues/2062
    !ssrBuild && !legacy && vitePlugins.push(splitVendorChunkPlugin())
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
    const { pt } = await import('./plugins/publicTypescript')
    vitePlugins.push(pt(publicTypescript!))
  }

  if (logAppInfo) {
    const { logAppInfo: logAppInfoPlugin } = await import('./plugins/logAppInfo')
    vitePlugins.push(logAppInfoPlugin(configEnv))
  }

  debug('plugins:', vitePlugins)

  return vitePlugins
}

const getDefaultConfig = async (config: { root: string } & ConfigEnv, options?: PluginOptions): Promise<UserConfig> => {
  const { root, ...configEnv } = config
  const alias = pathsMapToAlias(root)

  return {
    root,
    mode: configEnv.mode,
    resolve: {
      alias,
    },
    plugins: await setupPlugins(options || {}, configEnv),
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
      target: options?.legacy === false ? esbuildTarget : undefined,
      reportCompressedSize: false,
      rollupOptions: {
        treeshake: true,
      },
      cssCodeSplit: true,
      manifest: !configEnv.ssrBuild,
      ssrManifest: configEnv.ssrBuild,
    },
  }
}

const overrideConfig = async (configEnv: ConfigEnv, userConfig: UserConfig, options?: PluginOptions) => {
  const { mode } = configEnv
  const root = userConfig.root || process.cwd()
  const config = viteMergeConfig(await getDefaultConfig({ root, ...configEnv }, options), userConfig)
  debug('config:', config)
  const env = loadEnv(mode, root)
  debug('env:', env)
  injectEnv(env)
  return config
}

export * from './utils/rollupOptions'
export { getDefaultConfig, overrideConfig, injectEnv }
