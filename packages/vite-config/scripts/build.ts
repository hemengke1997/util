import { build } from '../../../scripts/build'

build({
  dts: {
    banner: '/// <reference types="vite/client" />',
  },
  entry: ['./src/node/index.ts'],
  target: 'es6',
  outDir: 'dist/node',
})

build({
  dts: {
    banner: '/// <reference types="vite/client" />',
  },
  entry: ['./src/client/index.ts'],
  target: 'esnext',
  outDir: 'dist/client',
  format: ['esm'],
})
