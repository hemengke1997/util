import { build } from '~scripts/build'
import tsupConfig from './tsup.config'

build({
  format: ['cjs'],
  ...tsupConfig,
  dts: false,
})

build({
  dts: {
    banner: '/// <reference types="lodash-es" />\n',
    resolve: ['deepmerge'],
  },
  format: ['esm'],
  ...tsupConfig,
})
