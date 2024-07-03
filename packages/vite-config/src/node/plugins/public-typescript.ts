import { type VitePublicTypescriptOptions, publicTypescript } from 'vite-plugin-public-typescript'

export function pt(options: VitePublicTypescriptOptions) {
  return publicTypescript({
    ...options,
  })
}
