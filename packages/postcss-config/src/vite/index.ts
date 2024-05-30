import { merge } from '@minko-fe/lodash-pro'
import { createRequire } from 'node:module'
import { type AcceptedPlugin } from 'postcss'
import { type PostcssConfig, postcssConfig } from '..'

const require = createRequire(import.meta.url)

const defaultOptions: Required<PostcssConfig> = {
  'postcss-import': false,
  'tailwindcss/nesting': true,
  'tailwindcss': true,
  'postcss-pxtorem': false,
  'postcss-pxtoviewport': false,
  'autoprefixer': true,
  'postcss-preset-env': false,
}

const pluginsForVite: AcceptedPlugin[] = []

function unPlugins(pluginName: string, options?: any) {
  pluginsForVite.push(options ? require(pluginName)(options) : require(pluginName))
}

export function definePlugins(options: PostcssConfig) {
  options = merge(defaultOptions, options || {})!
  postcssConfig(options, unPlugins)
  return pluginsForVite
}
