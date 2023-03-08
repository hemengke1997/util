import type { Options } from 'tsup'
import { dev } from '../../../scripts/dev'
import tsupConfig from './tsup.config'

dev(tsupConfig as Options)
