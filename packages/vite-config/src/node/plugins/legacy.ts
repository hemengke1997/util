import pluginLegacy from '@vitejs/plugin-legacy'

export type LegacyOptions = Parameters<typeof pluginLegacy>[0]

export function legacy(options?: LegacyOptions) {
  return pluginLegacy({
    ...options,
  })
}
