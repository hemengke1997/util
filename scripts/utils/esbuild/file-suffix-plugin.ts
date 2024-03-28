import { match } from 'bundle-require'
import { type Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { type Options } from 'tsup'

// To aviod nodejs error: ERR_UNSUPPORTED_DIR_IMPORT
export const fileSuffixPlugin = (format: 'cjs' | 'esm', tsupOptions?: Options): Plugin => ({
  name: 'add-file-suffix',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point') return
      let importeePath = args.path

      const { external, noExternal } = tsupOptions ?? {}
      if (match(importeePath, noExternal)) {
        return
      }
      if (match(importeePath, external)) {
        return { external: true }
      }

      if (match(args.importer, noExternal)) {
        return
      }
      if (match(args.importer, external)) {
        return { external: true }
      }

      // is external module
      if (importeePath[0] !== '.' && !path.isAbsolute(importeePath)) {
        return { external: true }
      }

      const suffix = format === 'cjs' ? '.cjs' : '.js'

      if (!path.extname(importeePath) && !importeePath.endsWith('.js')) {
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
