import tsupConfig from './tsup.config'
import { dev } from '~scripts/dev'

dev({
  format: ['cjs'],
  ...tsupConfig('cjs'),
})

dev({
  format: ['esm'],
  ...tsupConfig('esm'),
})
