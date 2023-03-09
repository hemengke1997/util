import type { Options } from 'tsup'
import { getEntry } from '../../../tsup.config'

export default {
  entry: await getEntry('src/**/index.ts'),
  target: 'es6',
} as Options
