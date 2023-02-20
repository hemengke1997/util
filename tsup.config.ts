import { extname, join, normalize, sep } from 'path'
import glob from 'tiny-glob'
import { defineConfig } from 'tsup'

function stripDir(pathStr: string, len: number) {
  const pathComponents = normalize(pathStr).split(sep)
  if (pathComponents.length > 1 && pathComponents[0] === '.') {
    pathComponents.shift()
  }
  return join(...pathComponents.slice(len))
}

const entries = await glob('./src/index.ts{,x}')

function rmExt(path: string) {
  return path.split(extname(path))[0]
}

function getEntry() {
  const entry: Record<string, string> = {}
  entries.forEach((e) => {
    entry[rmExt(stripDir(e, 1))] = e
  })

  return entry
}

export const tsup = defineConfig(async (option) => ({
  entry: getEntry(),
  dts: true,
  clean: false,
  format: ['esm'],
  minify: false,
  platform: 'node',
  target: 'es6',
  sourcemap: !!option.watch,
  tsconfig: option.watch ? './tsconfig.dev.json' : './tsconfig.json',
  external: ['react', 'react-router-dom', 'lodash-es'],
  splitting: false,
  treeshake: true,
  bundle: true,
}))
