import { type Plugin } from 'esbuild'
import fs from 'fs-extra'
import path from 'node:path'

export const fileSuffixPlugin: Plugin = {
  name: 'add-file-suffix',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point') return
      let importeePath = args.path

      // is external module?
      if (importeePath[0] !== '.' && !path.isAbsolute(importeePath)) {
        return {}
      }
      if (!importeePath.endsWith('.js')) {
        // is path dir?
        const filePath = path.join(args.resolveDir, importeePath)

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          // if path is dir, then append /index.js
          importeePath += '/index.js'
        } else {
          // else append .js
          importeePath += '.js'
        }
      }
      return { path: importeePath, external: true }
    })
  },
}
