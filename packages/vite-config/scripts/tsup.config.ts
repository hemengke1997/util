import { type Options } from 'tsup'

export default {
  entry: {
    'node/index': './src/node/index.ts',
    'client/index': './src/client/index.ts',
    'client/manifest': './src/client/manifest.ts',
  },
  target: 'es6',
  format: ['cjs', 'esm'],
  external: [/^virtual:.*/],
} as Options
