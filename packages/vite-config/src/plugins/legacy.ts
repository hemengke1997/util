import pluginLegacy from '@vitejs/plugin-legacy'
import browserslist from 'browserslist'

export type legacyOptions = Parameters<typeof pluginLegacy>[0]

export function legacy(options?: legacyOptions) {
  const browserslistConfig = browserslist.loadConfig({ path: '.' })

  return pluginLegacy({
    renderLegacyChunks: true,
    targets: browserslistConfig || 'defaults',
    polyfills: true,
    ignoreBrowserslistConfig: true,
    ...options,
  })
}
