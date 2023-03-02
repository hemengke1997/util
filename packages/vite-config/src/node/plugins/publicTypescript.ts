import type { VPPTPluginOptions } from 'vite-plugin-public-typescript'
import { publicTypescript } from 'vite-plugin-public-typescript'

export function pt(options: VPPTPluginOptions) {
  return publicTypescript({
    ...options,
  })
}
