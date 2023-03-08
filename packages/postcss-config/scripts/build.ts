import { build } from '../../../scripts/build'
import { getEntry } from '../../../tsup.config'

build({ entry: await getEntry('src/**/index.ts'), target: 'esnext' })
