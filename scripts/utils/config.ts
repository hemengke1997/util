import { type Options } from 'tsup'
import { getEntry } from '.'

export const defaultConfig: Options = {
  entry: getEntry(),
  splitting: false,
  watch: false,
  treeshake: true,
  target: 'es2015',
  shims: false,
  clean: false,
  config: false,
  platform: 'node',
  format: ['esm', 'cjs'],
  external: ['react', 'react-dom', /^virtual:.*/],
}
