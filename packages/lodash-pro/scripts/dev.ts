import { dev } from '~scripts/dev'
import tsupConfig from './tsup.config'

dev(tsupConfig('cjs'))

dev(tsupConfig('esm'))
