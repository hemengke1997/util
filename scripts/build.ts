import type { Options } from 'tsup'
import { build as tsupBuild } from 'tsup'
import { getTsconfig } from 'get-tsconfig'
import { isObject, isUndefined } from '@minko-fe/lodash-pro'
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
      !watchMode && (opt.drop = ['console', 'debugger'])
      opt.logOverride = {
        'empty-import-meta': 'silent',
      }
      options.esbuildOptions?.(opt, { format })
    },
    external: [...(defaultConfig.external || []), ...(options.external || [])],
    dts,
  })
}

export { build }
