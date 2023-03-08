import path from 'path'
import { defineConfig } from 'tsup'

const format: string[] = []
let n = 0

export default defineConfig({
  noExternal: ['lodash', 'lodash-es'],
  esbuildPlugins: [
    {
      name: 'test',
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          const id = args.path
          if (id[0] !== '.' && !path.isAbsolute(id)) {
            if (id.includes('lodash')) {
              let p = ''
              if (format[n] === 'esm') {
                p = 'lodash-es'
              } else if (format[n] === 'cjs') {
                p = 'lodash'
              }
              n--
              return {
                external: true,
                sideEffects: false,
                path: p,
              }
            }
            return {}
          }
        })
      },
    },
  ],
  esbuildOptions(_, ctx) {
    format.push(ctx.format)
    n = format.length - 1
  },
})
