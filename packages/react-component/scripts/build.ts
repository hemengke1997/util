import { build } from '~scripts/build'
import { cjs, esm } from './tsup.config'

build(cjs)
build(esm)
