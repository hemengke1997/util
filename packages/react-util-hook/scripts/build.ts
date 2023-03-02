import { build } from '../../../scripts/build'

build({
  target: 'esnext',
  external: ['react-router'],
  dts: {
    compilerOptions: {
      strict: false, // TODO: figure out what cause github action building failed
    },
  },
})
