import { build } from '../../../scripts/build'
import tsupConfig from './tsup.config'

build({
  dts: {
    banner: '/// <reference types="lodash-es" />',
  },
  format: ['cjs'],
  ...tsupConfig('cjs'),
})

build({
  dts: {
    banner: '/// <reference types="lodash-es" />',
  },
  format: ['esm'],
  ...tsupConfig('esm'),
})
