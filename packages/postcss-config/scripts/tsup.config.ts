import { getEntry } from '~scripts/utils'
import { type Options } from 'tsup'

export default {
  entry: await getEntry('src/**/index.ts'),
  target: 'es6',
} as Options
