import { build } from '../../../scripts/build'
import tsupConfig from './tsup.config'

build({
  dts: {
    banner: '/// <reference types="lodash-es" />',
  },
  ...tsupConfig,
})
