import { build } from '../../../scripts/build'

build({
  dts: {
    banner: '/// <reference types="vite/client" />',
  },
})
