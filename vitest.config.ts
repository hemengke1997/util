import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    onConsoleLog(log) {
      if (log.includes('Generated an empty chunk')) {
        return false
      }
      return undefined
    },
  },
})
