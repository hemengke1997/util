import { getEntry } from '~scripts/utils'
import { type Options } from 'tsup'

export default {
  entry: getEntry('src/**/index.ts'),
  target: 'esnext',
} as Options
