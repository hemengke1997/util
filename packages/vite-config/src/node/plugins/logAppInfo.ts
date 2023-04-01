import type { ConfigEnv, PluginOption } from 'vite'
import { logTimeInfo } from 'picologger'

export function logAppInfo(configEnv: ConfigEnv): PluginOption {
  const { mode } = configEnv

  const infoStr = logTimeInfo(mode)

  return {
    name: 'vite:log-app-info',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return {
          html,
          tags: [
            {
              injectTo: 'body',
              children: infoStr,
              tag: 'script',
            },
          ],
        }
      },
    },
  }
}
