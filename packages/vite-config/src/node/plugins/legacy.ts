import pluginLegacy from '@vitejs/plugin-legacy'

export type legacyOptions = Parameters<typeof pluginLegacy>[0]

export function legacy(options?: legacyOptions) {
  return pluginLegacy({
    ...options,
  })
}
