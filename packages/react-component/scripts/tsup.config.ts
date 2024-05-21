import { getEntry } from '~scripts/utils'
import { type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

const tsupConfig: Options = {
  // tree-shaking
  entry: ['src/**/*.{ts,tsx,css}'],
  dts: {
    entry: getEntry('src/**/*.{ts,tsx}'),
  },
  platform: 'browser',
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
