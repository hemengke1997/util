import { publicTypescript, type VitePublicTypescriptOptions } from 'vite-plugin-public-typescript'

export function pt(options: VitePublicTypescriptOptions) {
  return publicTypescript({
    ...options,
  })
}
