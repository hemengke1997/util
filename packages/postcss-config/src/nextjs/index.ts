import { merge } from '@minko-fe/lodash-pro'
import { type PostcssConfig, postcssConfig } from '..'

const defaultOptions: Required<PostcssConfig> = {
  'postcss-import': true,
  'tailwindcss/nesting': true,
  'tailwindcss': true,
  'postcss-pxtorem': false,
  'postcss-pxtoviewport': false,
  'autoprefixer': true,
  'postcss-preset-env': true,
}

const pluginsForNextjs: (string | any[])[] = []

function unPlugins(pluginName: string, options?: any) {
  pluginsForNextjs.push(options ? [pluginName, options] : pluginName)
}

export function definePlugins(options: PostcssConfig) {
  options = merge(defaultOptions, options || {})!
  postcssConfig(options, unPlugins)
  return pluginsForNextjs
}
