import { build } from '~scripts/build'
import { cjs, esm } from './tsup.config'

build(esm)

build(cjs)
