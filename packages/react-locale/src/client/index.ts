import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
import allLangs from 'virtual:i18n-resources:all'

const PKGNAME = 'react-locale/client'

type I18nSetupOptions =
  | {
      fallbackLng?: string
      lookupTarget?: string
      debug?: boolean
      onLocaleChange: (() => void) | undefined
    } & InitOptions

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

    // Notify UI framewrok render
    if (!mounted && onLocaleChange) {
      mounted = true
      onLocaleChange()
    }
  }

  const _changeLanguage = i18next.changeLanguage
  i18next.changeLanguage = async (lang: string | undefined) => {
    if (!lang) {
      console.warn(`[${PKGNAME}]: Language is undefined, fallback to '${fallbackLng}'`)
      lang = fallbackLng
    }
    if (!(lang in allLangs)) {
      console.warn(
        `[${PKGNAME}]: Language '${lang}' is detected but which is not defined in locales, fallback to '${fallbackLng}'. Please check your locales folder`,
      )
      lang = fallbackLng
    }
    await load(lang)
    return _changeLanguage(lang)
  }

  i18next.on('languageChanged', (lang) => {
    load(lang)
  })

  i18next.changeLanguage(lng)
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
