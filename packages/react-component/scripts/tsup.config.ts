import { type Options } from 'tsup'

export default {
  entry: ['src/**/*.{ts,tsx,css}'],
  bundle: false,
  legacyOutput: true,
} as Options
