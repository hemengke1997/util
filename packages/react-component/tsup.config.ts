import { defineConfig } from 'tsup'
import { defaultConfig } from '../../tsup.config'

export default defineConfig(() => {
  return {
    ...defaultConfig,
    banner({ format }) {
      if (format === 'cjs') {
        return { js: 'require("./index.css")' }
      }
      if (format === 'esm') {
        return { js: 'import "./index.css"' }
      }
    },
  }
})
