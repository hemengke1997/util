import type { Options } from 'tsup'
import { getEntry } from '../../../scripts/utils'

export default {
  entry: await getEntry('src/**/index.ts'),
  target: 'esnext',
} as Options
