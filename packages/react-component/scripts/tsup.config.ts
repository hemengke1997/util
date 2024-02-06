import { type Options } from 'tsup'

export default {
  // tree-shaking
  entry: ['src/**/*.{ts,tsx,css}'],
  bundle: false,
  legacyOutput: true,
} as Options
