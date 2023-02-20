import type { PluginOption } from 'vite'

export function injectEnv(envConf: Record<string, any>): ImportMetaEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }

  return ret
}

export async function setupPlugins() {
  const vitePlugins: PluginOption[] = [
    // react(),
    // publicTypescript({
    //   esbuildOptions: {
    //     target: 'es2015',
    //   },
    // }),
    // splitVendorChunkPlugin(),
    // progress(),
  ]

  const x = await import('@vitejs/plugin-react')
  if (x) {
    console.log(x, 'x')
  }
  return vitePlugins
}
