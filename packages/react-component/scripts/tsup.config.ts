import { fileSuffixPlugin, getEntry } from '~scripts/utils'
import { type Options } from 'tsup'

const tsupConfig: Options = {
  // tree-shaking
  entry: ['src/**/*.{ts,tsx,css}'],
  dts: {
    entry: getEntry('src/**/*.{ts,tsx}'),
  },
}

export const esm: Options = {
  ...tsupConfig,
  format: ['esm'],
  outDir: 'dist/es',
  outExtension: () => ({ js: '.js' }),
  esbuildPlugins: [fileSuffixPlugin('esm')],
}

export const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  outExtension: () => ({ js: '.cjs' }),
  esbuildPlugins: [fileSuffixPlugin('cjs')],
}
