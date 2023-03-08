import { createRequire } from 'module'
import type { AcceptedPlugin } from 'postcss'
import type { Config } from 'tailwindcss'
import { deepMerge, isObject } from '@minko-fe/lodash-pro'
import type { PxtoremOptions } from '@minko-fe/postcss-pxtorem'
import type { PxtoviewportOptions } from '@minko-fe/postcss-pxtoviewport'
import type { pluginOptions } from 'postcss-preset-env'
import browserslist from 'browserslist'

const _require = createRequire(import.meta.url)

export interface PostcssConfig {
  /**
   * @default true
   * @description vite环境请设置false
   */
  'postcss-import'?: boolean
  /**
   * @default true
   */
  'tailwindcss/nesting'?: boolean
  /**
   * @default true
   */
  'tailwindcss'?: Config | boolean
  /**
   * @default false
   */
  'postcss-pxtorem'?: boolean | PxtoremOptions
  /**
   * @default false
   */
  'postcss-pxtoviewport'?: boolean | PxtoviewportOptions
  /**
   * @default { features: { 'nesting-rules': false } }
   */
  'postcss-preset-env'?: pluginOptions | boolean
}

const postcssConfig = (config: PostcssConfig) => {
  const plugins: AcceptedPlugin[] = []

  if (config['postcss-import'] !== false) {
    plugins.push(_require('postcss-import'))
  }

  if (config['tailwindcss/nesting'] !== false) {
    plugins.push(_require('tailwindcss/nesting'))
  }

  {
    const { tailwindcss } = config
    if (tailwindcss !== false) {
      const options = isObject(tailwindcss) ? tailwindcss : {}
      plugins.push(_require('tailwindcss')(options))
    }
  }

  {
    const pxtorem = config['postcss-pxtorem']
    if (pxtorem) {
      const options = isObject(pxtorem) ? pxtorem : {}
      plugins.push(_require('@minko-fe/postcss-pxtorem')(options))
    }
  }

  {
    const pxtoviewport = config['postcss-pxtoviewport']
    if (pxtoviewport) {
      const options = isObject(pxtoviewport) ? pxtoviewport : {}
      plugins.push(_require('@minko-fe/postcss-pxtoviewport')(options))
    }
  }

  // last
  {
    const presetEnv = config['postcss-preset-env']
    if (presetEnv !== false) {
      const defaultBrowserslist = browserslist.loadConfig({ path: '.' })

      const defaultOptions: pluginOptions = { browsers: defaultBrowserslist }

      const options = isObject(presetEnv) ? deepMerge(presetEnv, defaultOptions) : defaultOptions

      if (config['tailwindcss/nesting'] !== false) {
        options.features = options.features || {}
        options.features!['nesting-rules'] = false
      }

      plugins.push(_require('postcss-preset-env')(options))
    }
  }

  return plugins
}

export function definePlugins(config: PostcssConfig) {
  return postcssConfig(config)
}
