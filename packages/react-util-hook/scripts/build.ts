import { build } from '../../../scripts/build'

build({
  target: 'esnext',
  external: ['react-router'],
})
