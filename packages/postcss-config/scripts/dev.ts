import { dev } from '../../../scripts/dev'
import { getEntry } from '../../../tsup.config'

dev({ entry: await getEntry('src/**/index.ts'), target: 'esnext' })
