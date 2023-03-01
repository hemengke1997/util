import { dev } from '../../../scripts/dev'

dev({
  tsup: {
    external: ['react', 'react-router', 'react-router-dom'],
  },
})
