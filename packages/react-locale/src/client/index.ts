import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
import type { I18nSetupOptions } from 'vite-plugin-i18n-detector/client'
import { setupI18n as _setupI18n } from 'vite-plugin-i18n-detector/client'

type SetupOptions = InitOptions & {
  fallbackLng?: string
  lookupTarget?: string
  debug?: boolean
} & Omit<I18nSetupOptions, 'i18n'>

function setupI18n(options: SetupOptions) {
  const {
    fallbackLng = 'en',
    lookupTarget = 'lang',
    debug = isDev(),
    onLocaleChange,
    setQueryOnChange,
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
      nsSeparator: '.',
      keySeparator: false,
      interpolation: {
        escapeValue: false,
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

  _setupI18n({
    i18n: i18next,
    onLocaleChange,
    setQueryOnChange,
  })
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
