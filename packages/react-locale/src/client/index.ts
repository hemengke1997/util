import type { InitOptions } from 'i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { isDev } from '@minko-fe/vite-config/client'
import helper from 'virtual:i18n-helper'

const PKGNAME = 'react-locale/client'

type I18nSetupOptions = InitOptions & {
  fallbackLng?: string
  lookupTarget?: string
  debug?: boolean
  setQueryOnChange?: boolean
  onLocaleChange: () => void
}

function setupI18n(options: I18nSetupOptions) {
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

  const lng = i18next.language || fallbackLng
  let currentLng: string | undefined = lng

  async function load(lang: string | undefined, onLoaded?: () => void) {
    if (!lang) {
      console.warn(`[${PKGNAME}]: Language is undefined, fallback to '${fallbackLng}'`)
      lang = fallbackLng
    }
    if (!(lang in helper)) {
      console.warn(
        `[${PKGNAME}]: Language '${lang}' is detected but which is not defined in locales, fallback to '${fallbackLng}'. Please check your locales folder`,
      )
      lang = fallbackLng
    }

    const lazyload: () => Promise<{ default: Record<string, any> | undefined }> = helper[lang]

    const langs = (await lazyload()).default

    if (!langs) {
      console.warn(`[${PKGNAME}]: No locales detected, please ensure 'localeEntry' and locale files exist`)
      return
    }

    Object.keys(langs).forEach((ns) => {
      i18next.addResourceBundle(lang!, ns, langs[ns])
    })

    onLoaded?.()
  }

  async function setLangAttrs(lang: string) {
    /**
     * NOTE:
     * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
     * The following is an example for axios.
     *
     * axios.defaults.headers.common['Accept-Language'] = lang
     */
    document.querySelector('html')?.setAttribute('lang', lang)
    if (setQueryOnChange) {
      const queryString = (await import('query-string')).default
      const query = queryString.parse(location.search)
      query[lookupTarget] = lang
      history.replaceState({ query }, '', queryString.stringifyUrl({ url: window.location.href, query }))
    }
  }

  const _changeLanguage = i18next.changeLanguage
  i18next.changeLanguage = async (lang: string | undefined, ...args) => {
    if (currentLng === lang) return undefined as any
    currentLng = lang
    await load(lang)
    return _changeLanguage(lang, ...args)
  }

  i18next.on('languageChanged', (lang) => {
    setLangAttrs(lang)
  })

  setLangAttrs(lng)

  // Load fallbackLng first
  if (lng !== fallbackLng) {
    load(fallbackLng)
  }

  load(lng, () => {
    // Notify UI framewrok render
    onLocaleChange()
  })
}

export { setupI18n }
export { i18next }
export * from 'react-i18next'
