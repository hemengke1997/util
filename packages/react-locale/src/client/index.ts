/// <reference types="vite/client" />

import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
import { resources } from 'virtual:i18n-resources'

type I18nSetupOptions =
  | {
      fallbackLng?: string
      lookupTarget?: string
      debug?: boolean
    } & InitOptions

async function setupI18n(options?: I18nSetupOptions) {
  const { fallbackLng = 'en', lookupTarget = 'lang', debug = isDev(), ...rest } = options || {}
  const r = await import('virtual:i18n-resources')
  console.log(r, 'r')
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug,
      resources,
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

  // i18next.on('languageChanged', (lng) => {
  //   // add resource
  // })
}

export { setupI18n }
export { resources }
export { i18next }
export * from 'react-i18next'
