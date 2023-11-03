import { dev } from '~scripts/dev'
import tsupConfig from './tsup.config'

dev({
  ...tsupConfig,
  format: ['esm'],
  dts: false,
})
