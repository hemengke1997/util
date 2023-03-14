import { build } from '../../../scripts/build'
import { getEntry } from '../../../tsup.config'
import tsupConfig from './tsup.config'

build({
  ...tsupConfig,
  format: ['esm', 'cjs'],
  dts: {
    entry: await getEntry('src/**/*.{ts,tsx}'),
  },
})
