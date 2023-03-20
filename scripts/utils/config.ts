import type { Options } from 'tsup'
import { getEntry } from '.'

export const defaultConfig: Options = {
  entry: await getEntry(),
  splitting: false,
  watch: false,
  treeshake: true,
  target: 'es6',
  minify: false,
  keepNames: true,
  shims: true,
  clean: false,
  config: false,
  platform: 'node',
  format: ['esm', 'cjs'],
  external: ['react', 'react-router-dom'],
}
