import { type Options } from 'tsup'

export default {
  entry: {
    'node/index': './src/node/index.ts',
    'client/index': './src/client/index.ts',
  },
  target: 'esnext',
  format: ['cjs', 'esm'],
} as Options
