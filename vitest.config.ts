import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: false,
    onConsoleLog(log) {
      if (log.includes('Generated an empty chunk')) {
        return false
      }
      return undefined
    },
    globals: true,
  },
})
