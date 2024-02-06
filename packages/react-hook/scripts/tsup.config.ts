import { fileSuffixPlugin } from '~scripts/utils'
import { type Options } from 'tsup'

export default {
  entry: ['src/**/*.ts'],
  bundle: true,
  format: ['cjs', 'esm'],
  legacyOutput: true,
  platform: 'browser',
  splitting: false,
  esbuildPlugins: [fileSuffixPlugin],
} as Options
