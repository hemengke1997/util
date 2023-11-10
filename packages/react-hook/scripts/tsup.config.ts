import { type Options } from 'tsup'

export default {
  target: 'esnext',
  external: ['react-router', 'react-router-dom'],
  entry: {
    index: 'src/index.ts',
    useUrlState: 'src/useUrlState.ts',
  },
} as Options
