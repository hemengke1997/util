import tsconfigPaths from 'vite-tsconfig-paths'

export function tsconfigPathsPlugin(options = {}) {
  return tsconfigPaths(options)
}
