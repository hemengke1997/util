import { dev } from '../../../scripts/dev'

dev({
  tsup: {
    entry: ['./src/node/index.ts'],
    target: 'es6',
    outDir: 'dist/node',
  },
})

dev({
  tsup: {
    entry: ['./src/client/index.ts'],
    target: 'esnext',
    outDir: 'dist/client',
    format: ['esm'],
  },
})
