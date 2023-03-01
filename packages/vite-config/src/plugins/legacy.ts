import pluginLegacy from '@vitejs/plugin-legacy'
import browserslist from 'browserslist'

export function legacy(options?: Parameters<typeof pluginLegacy>[0]) {
  const browserslistConfig = browserslist.loadConfig({ path: '.' })

  return pluginLegacy({
    renderLegacyChunks: true,
    targets: browserslistConfig || ['defaults'],
    polyfills: true,
    ignoreBrowserslistConfig: true,
    ...options,
  })
}
