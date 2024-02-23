import { deepMerge, isBoolean } from '@minko-fe/lodash-pro'
import createDebug from 'debug'
import glob from 'fast-glob'
import {
  type ConfigEnv,
  type PluginOption,
  type UserConfig,
  loadEnv,
  normalizePath,
  splitVendorChunkPlugin,
  mergeConfig as viteMergeConfig,
} from 'vite'
import { type VPPTPluginOptions } from 'vite-plugin-public-typescript'
import { type VitePluginSvgrOptions } from 'vite-plugin-svgr'
import { type viteVConsoleOptions } from 'vite-plugin-vconsole'
import { type CompressOptions } from './plugins/compress'
import { type LegacyOptions } from './plugins/legacy'
import { visualizer as visualizerPlugin } from './plugins/visualizer'
import { injectEnv, pathsMapToAlias } from './utils'

const debug = createDebug('vite-config')

interface PluginOptions {
  /**
   * @default
   * { svgrOptions: { icon: true } }
   */
  svgr?: VitePluginSvgrOptions | false
  /**
   * @default false
   */
  compress?: CompressOptions | false
  /**
   * @default
   * { renderLegacyChunks: true, polyfills: true, modernPolyfills: true, renderModernChunks: true }
   */
  legacy?: LegacyOptions | false
  /**
   * @default
   * { esbuildOptions: { target: ['es2015'] } }
   */
  publicTypescript?: VPPTPluginOptions | false
  /**
   * @default
   * when csr and not legacy render
   * @suggestion
   * disable if you want legacy render
   */
  splitVendorChunk?: boolean
  /**
   * @default true
   */
  logAppInfo?: boolean
  /**
   * @default true
   */
  vConsole?: boolean | viteVConsoleOptions
}

// https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
const esbuildTarget = ['es2015']

const defaultOptions: PluginOptions = {
  svgr: { svgrOptions: { icon: true } },
  compress: false,
  legacy: {
    renderLegacyChunks: true,
    renderModernChunks: true,
    polyfills: true,
    modernPolyfills: true,
    additionalLegacyPolyfills: ['core-js/proposals/global-this'],
  },
  publicTypescript: {
    esbuildOptions: { target: esbuildTarget },
  },
  splitVendorChunk: undefined,
  logAppInfo: true,
  vConsole: true,
}

async function setupPlugins(options: PluginOptions, configEnv: ConfigEnv, root: string) {
  options = deepMerge(defaultOptions, options)

  debug('options:', options)

  const { isSsrBuild } = configEnv

  const { svgr, compress, legacy, publicTypescript, splitVendorChunk, logAppInfo, vConsole } =
    options as Required<PluginOptions>

  const vitePlugins: PluginOption = [visualizerPlugin()]

  if (svgr !== false) {
    const { svgr: svgrPlugin } = await import('./plugins/svgr')
    vitePlugins.push(svgrPlugin(svgr))
  }

  if (splitVendorChunk !== false) {
    // splitVendorChunk brings inline css which make style order
    // and css weights wrong in legacy render
    // https://github.com/vitejs/vite/issues/2062
    !isSsrBuild && !legacy && vitePlugins.push(splitVendorChunkPlugin())
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
    const { pt } = await import('./plugins/public-typescript')
    vitePlugins.push(pt(publicTypescript!))
  }

  if (logAppInfo) {
    const { logAppInfo: logAppInfoPlugin } = await import('./plugins/log-appinfo')
    vitePlugins.push(logAppInfoPlugin(configEnv))
  }

  if (vConsole) {
    const { vConsole: vConsolePlugin } = await import('./plugins/vconsole')
    const entries = await glob(normalizePath(`${root}/src/main.ts{,x}`))

    const consoleConfig = isBoolean(vConsole) ? ({} as viteVConsoleOptions) : vConsole

    vitePlugins.push(
      vConsolePlugin({
        ...consoleConfig,
        entry: consoleConfig?.entry || normalizePath(`${root}/${entries[0]}`),
      }),
    )
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
    plugins: await setupPlugins(options || {}, configEnv, root),
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
      ssrManifest: configEnv.isSsrBuild,
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
export { getDefaultConfig, injectEnv, overrideConfig }
export * from 'vite-plugin-public-typescript'
