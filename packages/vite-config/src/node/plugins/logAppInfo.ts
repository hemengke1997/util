import type { ConfigEnv, PluginOption } from 'vite'
import { logBuildInfo } from '@minko-fe/client-logger'

export function logAppInfo(configEnv: ConfigEnv): PluginOption {
  const { mode } = configEnv

  const infoStr = logBuildInfo(mode)

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
