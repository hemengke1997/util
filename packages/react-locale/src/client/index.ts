import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'

type I18nSetupOptions =
  | {
      fallbackLng?: string
      lookupTarget?: string
      debug?: boolean
      onLocaleChange: () => void
    } & InitOptions

// TODO: lazyload resource
export async function lazyloadResource(lang: string) {
  return (await import(/* @vite-ignore */ `/virtual:i18n-resources:${lang}`)).default
}

let mounted = false

function setupI18n(options: I18nSetupOptions) {
  const { fallbackLng = 'en', lookupTarget = 'lang', debug = isDev(), onLocaleChange, ...rest } = options || {}

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
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
      partialBundledLanguages: true,
      ns: [],
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

  const lng = i18next.language || fallbackLng

  async function load(lang: string) {
    const res = await lazyloadResource(lang)
    const langs = res[lang]

    Object.keys(langs).forEach((ns) => {
      i18next.addResourceBundle(lang, ns, langs[ns])
    })

    // callback
    // notify react render
    if (!mounted) {
      mounted = true
      onLocaleChange()
    }
  }

  i18next.on('languageChanged', (lang) => {
    load(lang)
  })

  const changeLanguage = i18next.changeLanguage

  i18next.changeLanguage = async (lang: string) => {
    await load(lang)
    return changeLanguage(lang)
  }

  i18next.changeLanguage(lng)
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
