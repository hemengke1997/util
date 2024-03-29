import { fileSuffixPlugin } from '~scripts/utils'
import { type Options } from 'tsup'

const tsupConfig: Options = {
  entry: ['src/**/*.ts'],
  splitting: false,
  dts: true,
}

export const esm: Options = {
  ...tsupConfig,
  format: ['esm'],
  target: 'es2020',
  outDir: 'dist/es',
  outExtension: () => ({ js: '.js' }),
  esbuildPlugins: [fileSuffixPlugin('esm')],
}

export const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  target: 'es2020',
  platform: 'node',
  outExtension: () => ({ js: '.cjs' }),
  noExternal: ['lodash-es', 'p-is-promise'],
  esbuildPlugins: [
    fileSuffixPlugin('cjs', {
      noExternal: ['lodash-es', 'p-is-promise'],
    }),
  ],
}
