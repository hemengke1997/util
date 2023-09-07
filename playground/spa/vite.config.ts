import path from 'path'
import type { HtmlTagDescriptor, PluginOption } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { overrideConfig } from '@minko-fe/vite-config'
import { i18nDetector } from '@minko-fe/react-locale/plugin'
import { createHtmlPlugin } from 'vite-plugin-html'
import manifest from './publicTypescript/manifest.json'

function setupHtml() {
  const tags: Parameters<typeof createHtmlPlugin>[0] = {
    minify: false,
    inject: {
      tags: [],
    },
  }

  tags.inject?.tags?.push(
    ...([
      {
        tag: 'script',
        attrs: {
          src: manifest.flexible,
        },
        injectTo: 'head-prepend',
      },
    ] as HtmlTagDescriptor[]),
  )
  const htmlPlugin: PluginOption[] = createHtmlPlugin(tags)
  return htmlPlugin
}

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
  return overrideConfig(
    env,
    {
      plugins: [
        react(),
        i18nDetector({
          localesPaths: [path.join(__dirname, './src/locale')],
          pathMatcher: '{locale}/{namespace}.{ext}',
          enabledParsers: ['json'],
        }),
        setupHtml(),
      ] as any,
      clearScreen: false,
    },
    {
      compress: false,
      publicTypescript: {
        sideEffects: true,
      },
    },
  )
})
