/// <reference types="vite/client" />

import i18next, { type InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { i18nAlly as _i18nAlly, type I18nSetupOptions } from 'vite-plugin-i18n-ally/client'

type SetupOptions = InitOptions & {
  fallbackLng?: string
  lookupTarget?: string
  debug?: boolean
  cache?: I18nSetupOptions['cache']
  onInited?: I18nSetupOptions['onInited']
  namespace?: boolean
}

function i18nAlly(options: SetupOptions) {
  const {
    fallbackLng = 'en',
    lookupTarget = 'lang',
    debug = false,
    cache,
    onInited,
    namespace = true,
    ...rest
  } = options || {}

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      returnNull: false,
      react: {
        useSuspense: true,
      },
      debug,
      resources: {},
      nsSeparator: namespace ? '.' : false,
      keySeparator: !namespace ? '.' : false,
      interpolation: {
        escapeValue: true,
      },
      fallbackLng,
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator'],
        caches: ['localStorage', 'sessionStorage', 'cookie'],
        lookupQuerystring: lookupTarget,
        lookupLocalStorage: lookupTarget,
        lookupSessionStorage: lookupTarget,
        lookupCookie: lookupTarget,
      },
      ...rest,
    })

  const { beforeLanguageChange } = _i18nAlly({
    language: i18next.language,
    onInited(langs, currentLang) {
      if (!langs.includes(i18next.language)) {
        i18next.changeLanguage(fallbackLng)
      }
      onInited?.(langs, currentLang)
    },
    onResourceLoaded: (resource, currentLang) => {
      if (namespace) {
        Object.keys(resource).forEach((ns) => {
          i18next.addResourceBundle(currentLang, ns, resource[ns])
        })
      } else {
        i18next.addResourceBundle(currentLang, i18next.options.defaultNS?.[0], resource)
      }
    },
    cache,
    fallbackLng,
  })

  const _changeLanguage = i18next.changeLanguage
  i18next.changeLanguage = async (lang: string | undefined, ...args) => {
    let currentLng = i18next.language
    // If language did't change, return
    if (currentLng === lang) return undefined as any
    currentLng = lang || currentLng
    await beforeLanguageChange(currentLng)
    return _changeLanguage(currentLng, ...args)
  }
}

export { i18nAlly }
export { i18next }
