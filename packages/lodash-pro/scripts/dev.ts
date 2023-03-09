import { dev } from '../../../scripts/dev'
import tsupConfig from './tsup.config'

dev({
  format: ['cjs'],
  ...tsupConfig('cjs'),
})

dev({
  format: ['esm'],
  ...tsupConfig('esm'),
})
