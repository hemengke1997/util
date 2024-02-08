import { fileSuffixPlugin } from '~scripts/utils'
import { type Options } from 'tsup'

const tsupConfig: Options = {
  entry: ['src/**/*.ts'],
  bundle: true,
  platform: 'browser',
  splitting: false,
  outExtension: () => ({ js: '.js' }),
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
