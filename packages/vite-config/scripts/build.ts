import tsupConfig from './tsup.config'
import { build } from '~scripts/build'

build({
  dts: {
    banner: '/// <reference types="vite/client" />',
  },
  ...tsupConfig,
})
