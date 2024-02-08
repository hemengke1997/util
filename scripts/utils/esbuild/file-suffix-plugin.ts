import { type Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

// To aviod nodejs error: ERR_UNSUPPORTED_DIR_IMPORT
export const fileSuffixPlugin = (format: 'cjs' | 'esm'): Plugin => ({
  name: 'add-file-suffix',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point') return
      let importeePath = args.path

      // is external module
      if (importeePath[0] !== '.' && !path.isAbsolute(importeePath)) {
        return {}
      }

      const suffix = format === 'cjs' ? '.cjs' : '.js'

      if (!importeePath.endsWith('.js')) {
        // is path dir?
        const filePath = path.join(args.resolveDir, importeePath)

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          // if path is dir, then append /index.js
          importeePath += `/index${suffix}`
        } else {
          // else append .js
          importeePath += suffix
        }
        return { path: importeePath, external: true }
      }
      return {}
    })
  },
})
