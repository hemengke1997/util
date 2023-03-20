import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
// import resources from 'virtual:i18n-resources:all'

// const PKGNAME = 'react-locale/client'

type I18nSetupOptions =
  | {
      fallbackLng?: string
      lookupTarget?: string
      debug?: boolean
      onLocaleChange: (() => void) | undefined
    } & InitOptions

async function lazyloadAll() {
  return (await import('virtual:i18n-resources:all')).default
}

let mounted = false
let resourceCache: Record<string, any>

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
      // defaultNS: Object.keys(resources[fallbackLng]),
      // ns: Object.keys(resources[fallbackLng]),
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

  async function load() {
    resourceCache = await lazyloadAll()

    Object.keys(resourceCache).forEach((lang) => {
      const r = resourceCache[lang]
      Object.keys(r).forEach((ns) => {
        i18next.addResourceBundle(lang, ns, r[ns])
      })
    })

    // Notify UI framewrok render
    if (!mounted && onLocaleChange) {
      mounted = true
      onLocaleChange()
    }
  }

  const _changeLanguage = i18next.changeLanguage

  i18next.changeLanguage = (lang: string) => {
    /**
     * NOTE:
     * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
     * The following is an example for axios.
     *
     * axios.defaults.headers.common['Accept-Language'] = lang
     */
    document.querySelector('html')!.setAttribute('lang', lang)
    return _changeLanguage(lang)
  }

  i18next.on('languageChanged', () => {
    load()
  })

  load()
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
