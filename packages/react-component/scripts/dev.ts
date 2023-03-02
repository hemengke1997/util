import { dev } from '../../../scripts/dev'

dev({
  entry: ['src/**/*.{ts,tsx,css}'],
  bundle: false,
  format: ['esm'],
  dts: false,
  legacyOutput: true,
})
