import { dev } from '~scripts/dev'
import { cjs, esm } from './tsup.config'

dev(esm)

dev(cjs)
