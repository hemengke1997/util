import type { Options } from 'tsup'
import { build as tsupBuild } from 'tsup'
import { isObject } from '@minko-fe/lodash-pro'
import { getTsconfig } from 'get-tsconfig'
import { defaultConfig } from '../tsup.config'

async function build(opts: Options = {}) {
  let { dts } = opts

  const tsconfig = getTsconfig()

  if (isObject(dts)) {
    dts = {
      ...dts,
      compilerOptions: {
        ...tsconfig?.config.compilerOptions,
      },
    }
  }

  await tsupBuild({
    ...defaultConfig,
    ...opts,
    external: [...(defaultConfig.external || []), ...(opts.external || [])],
    dts,
  })
}

export { build }
