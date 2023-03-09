import type { Options } from 'tsup'
import { build as tsupBuild } from 'tsup'
import { getTsconfig } from 'get-tsconfig'
import { isObject, isUndefined } from '@minko-fe/lodash-pro'
import { defaultConfig } from '../tsup.config'

async function build(opts: Options = {}, watchMode = false) {
  let { dts } = opts

  const tsconfig = getTsconfig()

  if (isObject(dts) || isUndefined(dts)) {
    dts = {}
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
    ...opts,
    esbuildOptions(opt, { format }) {
      !watchMode && (opt.drop = ['console', 'debugger'])
      opts.esbuildOptions?.(opt, { format })
    },
    external: [...(defaultConfig.external || []), ...(opts.external || [])],
    dts,
  })
}

export { build }
