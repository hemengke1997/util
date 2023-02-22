import { build } from '../../../scripts/build'
import { getEntry } from '../../../tsup.config'

build({
  entry: ['src/**/*.{ts,tsx,css}'],
  bundle: false,
  format: ['esm', 'cjs'],
  dts: {
    entry: await getEntry('src/**/*.{ts,tsx}'),
  },
  legacyOutput: true,
  treeshake: false,
})
