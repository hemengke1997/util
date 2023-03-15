import type { PluginOption } from 'vite'
import { ClientLogger } from '../../client'

export function logAppInfo(): PluginOption {
  const currentBuildTime = new Date().toLocaleString()

  const logger = new ClientLogger(undefined, true)

  const t = logger.log({ text: 'BuildTime', type: 'warn' }, { text: currentBuildTime, type: 'info' })!

  return {
    name: 'vite:log-app-info',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            injectTo: 'body',
            children: `console.log(${t.map((str) => `"${str}"`)})`,
            tag: 'script',
          },
        ],
      }
    },
  }
}
