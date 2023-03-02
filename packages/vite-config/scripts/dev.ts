import { dev } from '../../../scripts/dev'

dev({
  entry: ['./src/node/index.ts'],
  target: 'es6',
  outDir: 'dist/node',
})

dev({
  entry: ['./src/client/index.ts'],
  target: 'esnext',
  outDir: 'dist/client',
  format: ['esm'], // import.meta is undefined in cjs
})
