import type { Format, Options } from 'tsup'
import type { Plugin } from 'esbuild'

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function alias(options: Record<string, string>, format: Format): Plugin {
  const aliases = Object.keys(options)
  const re = new RegExp(`^(${aliases.map((x) => escapeRegExp(x)).join('|')})$`)

  return {
    name: 'alias',
    setup(build) {
      build.onResolve({ filter: re }, (args) => {
        return {
          path: format === 'cjs' ? options[args.path] : args.path,
          external: true,
          sideEffects: false,
        }
      })
    },
  }
}

export default (format: Format) =>
  ({
    noExternal: ['lodash', 'lodash-es'],

    esbuildPlugins: [
      alias(
        {
          'lodash-es': 'lodash',
        },
        format,
      ),
    ],
  } as Options)
