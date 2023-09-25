import { type VPPTPluginOptions, publicTypescript } from 'vite-plugin-public-typescript'

export function pt(options: VPPTPluginOptions) {
  return publicTypescript({
    ...options,
  })
}
