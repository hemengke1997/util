/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

import { isArray } from '@minko-fe/lodash-pro'

export type Mod = string | { [key: string]: any }
export type Mods = Mod | Mod[]

function gen(name: string, mods?: Mods): string {
  if (!mods) {
    return ''
  }

  if (typeof mods === 'string') {
    return ` ${name}--${mods}`
  }

  if (isArray(mods)) {
    // @ts-expect-error
    return mods.reduce((ret: string, item: Mods | undefined) => ret + gen(name, item), '')
  }
  return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '')
}

export function createBEM(name: string) {
  return (el?: Mods, mods?: Mods): Mods => {
    if (el && typeof el !== 'string') {
      mods = el
      el = ''
    }

    el = el ? `${name}__${el as string}` : name
    return `${el}${gen(el, mods)}`
  }
}

export type BEM = ReturnType<typeof createBEM>

export type CreateNamespaceReturn = [BEM, string]

export function createNamespace(name: string, prefix?: string): CreateNamespaceReturn {
  name = `${prefix || 'rc'}-${name}`
  return [createBEM(name), name]
}
