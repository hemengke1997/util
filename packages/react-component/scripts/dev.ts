import { dev } from '../../../scripts/dev'

try {
  dev({
    tsup: {
      entry: ['src/**/*.{ts,tsx,css}'],
      bundle: false,
      format: ['esm'],
      dts: false,
      legacyOutput: true,
    },
  })
} catch {}
