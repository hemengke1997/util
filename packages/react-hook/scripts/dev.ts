import { dev } from '~scripts/dev'
import { cjs, esm } from './tsup.config'

dev(cjs)

dev(esm)
