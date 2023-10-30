import tsupConfig from './tsup.config'
import { getEntry } from '~scripts/utils'
import { build } from '~scripts/build'

build({
  ...tsupConfig,
  format: ['esm', 'cjs'],
  dts: {
    entry: await getEntry('src/**/*.{ts,tsx}'),
  },
})
