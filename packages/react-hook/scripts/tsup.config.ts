import { type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

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
  plugins: [bundleless({ ext: '.js' })],
}

export const cjs: Options = {
  ...tsupConfig,
  format: ['cjs'],
  outDir: 'dist/lib',
  outExtension: () => ({ js: '.cjs' }),
  plugins: [bundleless({ ext: '.cjs', bundle: true })],
}
