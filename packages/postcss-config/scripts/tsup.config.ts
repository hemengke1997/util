import type { Options } from 'tsup'
import { getEntry } from '../../../tsup.config'

export default {
  entry: await getEntry('src/**/index.ts'),
  target: 'esnext',
} as Options
