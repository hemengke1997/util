import svgrPlugin, { type VitePluginSvgrOptions } from 'vite-plugin-svgr'

export function svgr(options: VitePluginSvgrOptions) {
  return svgrPlugin(options)
}
