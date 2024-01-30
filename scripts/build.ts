import { isObject, isUndefined } from '@minko-fe/lodash-pro'
import { getTsconfig } from 'get-tsconfig'
import { type Options, build as tsupBuild } from 'tsup'
import { defaultConfig } from './utils/config'

async function build(options: Options = {}, watchMode = false) {
  let { dts } = options

  const tsconfig = getTsconfig()

  if (isObject(dts) || isUndefined(dts)) {
    dts = dts || {}
    dts = {
      ...dts,
      compilerOptions: {
        ...tsconfig?.config.compilerOptions,
        ...dts.compilerOptions,
      },
    }
  }

  await tsupBuild({
    ...defaultConfig,
    ...options,
    esbuildOptions(opt, { format }) {
      if (!watchMode) {
        opt.drop = ['debugger']
        opt.pure = ['console.log']
      }
      opt.logOverride = {
        'empty-import-meta': 'silent',
      }
      options.esbuildOptions?.(opt, { format })
    },
    external: [...(defaultConfig.external || []), ...(options.external || [])],
    dts,
    minify: true,
  })
}

export { build }
