import type { Options } from 'tsup'
import { build as tsupBuild } from 'tsup'
import { getTsconfig } from 'get-tsconfig'
import { isObject } from '../packages/lodash-pro/src' // TODO: replace with npm link
import { defaultConfig } from '../tsup.config'

async function build(opts: Options = {}) {
  let { dts } = opts

  const tsconfig = getTsconfig()

  if (isObject(dts)) {
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
    external: [...(defaultConfig.external || []), ...(opts.external || [])],
    dts,
  })
}

export { build }
