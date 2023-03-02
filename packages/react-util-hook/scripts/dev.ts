import { dev } from '../../../scripts/dev'

dev({
  tsup: {
    target: 'esnext',
    external: ['react-router'],
  },
})
