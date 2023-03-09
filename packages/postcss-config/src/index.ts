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
       * @description vite环境请设置false
       * @description 默认内置
       */
      'postcss-import'?: boolean
      /**
       * @default true
       * @description 默认内置
       */
      'tailwindcss/nesting'?: boolean
      /**
       * @default true
       * @description 默认内置
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
       * @description 默认内置
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

const postcssConfig = (options: PostcssConfig) => {
  const plugins: AcceptedPlugin[] = []

  options = deepMerge(defaultOptions, options || {})!

  if (options['postcss-import'] !== false) {
    plugins.push(_require('postcss-import'))
  }

  if (options['tailwindcss/nesting'] !== false) {
    plugins.push(_require('tailwindcss/nesting'))
  }

  {
    const { tailwindcss } = options
    if (tailwindcss !== false) {
      const options = isObject(tailwindcss) ? tailwindcss : undefined
      plugins.push(_require('tailwindcss')(options))
    }
  }

  {
    const pxtorem = options['postcss-pxtorem']
    if (pxtorem) {
      const options = isObject(pxtorem) ? pxtorem : {}
      plugins.push(_require('@minko-fe/postcss-pxtorem')(options))
    }
  }

  {
    const pxtoviewport = options['postcss-pxtoviewport']
    if (pxtoviewport) {
      const options = isObject(pxtoviewport) ? pxtoviewport : {}
      plugins.push(_require('@minko-fe/postcss-pxtoviewport')(options))
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

      plugins.push(_require('postcss-preset-env')(_options))
    }
  }

  return plugins
}

export function definePlugins(options: PostcssConfig) {
  return postcssConfig(options)
}
