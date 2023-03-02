import rollupVisualizer from 'rollup-plugin-visualizer'

export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}

export function visualizer() {
  if (isReportMode()) {
    return rollupVisualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  }
  return []
}
