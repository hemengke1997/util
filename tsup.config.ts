import { extname, join, normalize, sep } from 'path'
import glob from 'tiny-glob'
import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

function stripDir(pathStr: string, len: number) {
  const pathComponents = normalize(pathStr).split(sep)
  if (pathComponents.length > 1 && pathComponents[0] === '.') {
    pathComponents.shift()
  }
  return join(...pathComponents.slice(len))
}

function rmExt(path: string) {
  return path.split(extname(path))[0]
}

export async function getEntry(entryGlob = './src/index.ts{,x}') {
  const entries = await glob(entryGlob)
  const entry: Record<string, string> = {}
  entries.forEach((e) => {
    entry[rmExt(stripDir(e, 1))] = e
  })

  return entry
}

export const defaultConfig: Options = {
  entry: await getEntry(),
  splitting: false,
  watch: false,
  treeshake: true,
  target: 'es6',
  minify: false,
  clean: false,
  config: false,
  platform: 'node',
  format: ['esm', 'cjs'],
  external: ['react', 'react-router-dom'],
}

export default defineConfig(async () => ({
  ...defaultConfig,
}))
