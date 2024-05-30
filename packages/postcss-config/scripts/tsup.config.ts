import { getEntry } from '~scripts/utils'
import { type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

export default {
  entry: getEntry('src/**/index.ts'),
  target: 'es2022', // import.meta.env
  plugins: [bundleless()],
} as Options
