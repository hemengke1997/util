import { type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

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
  plugins: [bundleless({ ext: '.js' })],
}

export const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  target: 'es2020',
  platform: 'node',
  noExternal: ['lodash-es', 'p-is-promise'],
  outExtension: () => ({ js: '.cjs' }),
  plugins: [bundleless({ ext: '.cjs' })],
}
