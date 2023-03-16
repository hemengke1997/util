import { build } from '../../../scripts/build'
import { getEntry } from '../../../scripts/utils'
import tsupConfig from './tsup.config'

build({
  ...tsupConfig,
  format: ['esm', 'cjs'],
  dts: {
    entry: await getEntry('src/**/*.{ts,tsx}'),
  },
})
