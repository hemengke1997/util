import type { Options } from 'tsup'
import { build as tsupBuild } from 'tsup'

async function build(opts: Options = {}) {
  await tsupBuild({
    ...opts,
    config: false,
  })
}

export { build }
