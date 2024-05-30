import { getEntry } from '~scripts/utils'
import { type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'

export default {
  entry: getEntry('src/**/index.ts'),
  plugins: [bundleless()],
} as Options
