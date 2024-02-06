import { fileSuffixPlugin } from '~scripts/utils'
import { type Options } from 'tsup'

export default (format: 'cjs' | 'esm'): Options => ({
  entry: ['src/**/*.ts'],
  bundle: true,
  legacyOutput: true,
  format,
  dts: format === 'esm' ? { banner: '/// <reference types="lodash-es" />\n' } : false,
  noExternal: format === 'cjs' ? ['lodash-es'] : [],
  target: 'es6',
  splitting: false,
  platform: 'neutral',
  esbuildPlugins: format === 'esm' ? [fileSuffixPlugin] : undefined,
})
