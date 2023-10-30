import tsupConfig from './tsup.config'
import { dev } from '~scripts/dev'

dev({
  ...tsupConfig,
  format: ['esm'],
  dts: false,
})
