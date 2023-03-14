import type { PluginOption } from 'vite'

export function log(): PluginOption {
  const currentBuildTime = new Date().toLocaleString()

  return {
    name: 'vite:log-app-info',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            injectTo: 'body',
            children: `console.log('✨BuildTime: ${currentBuildTime}')`,
            tag: 'script',
          },
        ],
      }
    },
  }
}
