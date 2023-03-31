import { createRequire } from 'module'
import type { AcceptedPlugin } from 'postcss'
import type { Config } from 'tailwindcss'
import { deepMerge, isObject } from '@minko-fe/lodash-pro'
import type { PxtoremOptions } from '@minko-fe/postcss-pxtorem'
import type { PxtoviewportOptions } from '@minko-fe/postcss-pxtoviewport'
import type { pluginOptions } from 'postcss-preset-env'

const _require = createRequire(import.meta.url)

export type PostcssConfig =
  | {
      /**
       * @default true
       * @description set false in vite env
       * @description default built-in
       */
      'postcss-import'?: boolean
      /**
       * @default true
       * @description default built-in
       */
      'tailwindcss/nesting'?: boolean
      /**
       * @default true
       * @description default built-in
       */
      'tailwindcss'?: Config | boolean
      /**
       * @default false
       */
      'postcss-pxtorem'?: false | PxtoremOptions
      /**
       * @default false
       */
      'postcss-pxtoviewport'?: false | PxtoviewportOptions
      /**
       * @default true
       * @description default built-in
       */
      'postcss-preset-env'?: pluginOptions | boolean
    }
  | undefined

const defaultOptions: Required<PostcssConfig> = {
  'postcss-import': true,
  'tailwindcss/nesting': true,
  'tailwindcss': true,
  'postcss-pxtorem': false,
  'postcss-pxtoviewport': false,
  'postcss-preset-env': true,
}

const plugins: AcceptedPlugin[] = []

const pluginsForNextjs: (string | any[])[] = []

function unPlugins(pluginName: string, options?: any) {
  plugins.push(options ? _require(pluginName)(options) : _require(pluginName))
  pluginsForNextjs.push(options ? [pluginName, options] : pluginName)
}

const postcssConfig = (options: PostcssConfig) => {
  options = deepMerge(defaultOptions, options || {})!

  if (options['postcss-import'] !== false) {
    unPlugins('postcss-import')
  }

  if (options['tailwindcss/nesting'] !== false) {
    unPlugins('tailwindcss/nesting')
  }

  {
    const { tailwindcss } = options
    if (tailwindcss !== false) {
      const options = isObject(tailwindcss) ? tailwindcss : undefined
      unPlugins('tailwindcss', options)
    }
  }

  {
    const pxtorem = options['postcss-pxtorem']
    if (pxtorem) {
      unPlugins('@minko-fe/postcss-pxtorem', options)
    }
  }

  {
    const pxtoviewport = options['postcss-pxtoviewport']
    if (pxtoviewport) {
      unPlugins('@minko-fe/postcss-pxtoviewport', options)
    }
  }

  // last
  {
    const presetEnv = options['postcss-preset-env']

    if (presetEnv !== false) {
      const browserslist = _require('browserslist')

      const defaultBrowserslist = browserslist.loadConfig({ path: '.' })

      const defaultOptions: pluginOptions = { browsers: defaultBrowserslist, features: { 'nesting-rules': false } }

      const _options = deepMerge(defaultOptions, isObject(presetEnv) ? presetEnv : {})

      if (options['tailwindcss/nesting'] === false) {
        _options.features['nesting-rules'] = true
      }

      unPlugins('postcss-preset-env', _options)
    }
  }

  return [plugins, pluginsForNextjs]
}

export function definePlugins(options: PostcssConfig) {
  return postcssConfig(options)
}
