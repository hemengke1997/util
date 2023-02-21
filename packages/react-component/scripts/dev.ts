import { dev } from '../../../scripts/dev'

dev({
  tsup: {
    entry: ['src/**/*.{ts,tsx,css}'],
    bundle: false,
    format: ['esm'],
  },
})
