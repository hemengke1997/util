import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
import r from 'virtual:i18n-resources:all'

type I18nSetupOptions =
  | {
      fallbackLng?: string
      lookupTarget?: string
      debug?: boolean
    } & InitOptions

// async function lazyloadResource(lang: string) {
//   return (await import(/* @vite-ignore */ `/virtual:i18n-resources:${lang}`)).default
// }

async function setupI18n(options?: I18nSetupOptions) {
  const { fallbackLng = 'en', lookupTarget = 'lang', debug = isDev(), ...rest } = options || {}

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      react: {
        useSuspense: true,
      },
      debug,
      resources: r,
      nsSeparator: '.',
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
      fallbackLng,
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage'],
        caches: ['localStorage', 'sessionStorage', 'cookie'],
        lookupQuerystring: lookupTarget,
        lookupLocalStorage: lookupTarget,
        lookupSessionStorage: lookupTarget,
        lookupCookie: lookupTarget,
      },
      ...rest,
    })
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
