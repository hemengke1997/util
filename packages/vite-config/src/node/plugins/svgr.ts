import svgrPlugin, { type ViteSvgrOptions } from 'vite-plugin-svgr'

export function svgr(options: ViteSvgrOptions) {
  return svgrPlugin(options)
}
