import { Language } from '../types'

const LANGUAGE_COOKIE_NAME = 'language'

// Мапінг мов на ISO коди для атрибуту lang в HTML
const languageToISO: Record<Language, string> = {
  [Language.EN]: 'en',
  [Language.UK]: 'uk',
  [Language.DE]: 'de',
  [Language.ES]: 'es',
  [Language.FR]: 'fr',
  [Language.CS]: 'cs',
  [Language.PL]: 'pl',
  [Language.TR]: 'tr',
  [Language.HI]: 'hi',
  [Language.ZH]: 'zh'
}
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 рік в секундах

export const cookieUtils = {
  // Отримати мову з cookie
  getLanguage(): Language {
    if (typeof document === 'undefined') {
      return Language.EN // Fallback для сервера
    }

    const cookies = document.cookie.split(';')
    console.log('[cookieUtils] All cookies:', document.cookie)
    const languageCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`)
    )
    console.log('[cookieUtils] Language cookie found:', languageCookie)

    if (languageCookie) {
      const language = languageCookie.split('=')[1]?.trim()
      console.log('[cookieUtils] Parsed language:', language)
      if (Object.values(Language).includes(language as Language)) {
        return language as Language
      }
    }

    console.log('[cookieUtils] Returning default EN')
    return Language.EN // Fallback якщо немає cookie
  },

  // Встановити мову в cookie
  setLanguage(language: Language): void {
    if (typeof document === 'undefined') {
      console.log('[cookieUtils] setLanguage called on server, skipping')
      return
    }

    console.log('[cookieUtils] setLanguage called with:', language)
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1) // 1 рік
    const expiresString = expires.toUTCString()

    // Встановлюємо cookie 'language' для нашого додатку
    const languageCookie = `${LANGUAGE_COOKIE_NAME}=${language}; expires=${expiresString}; path=/; SameSite=Lax`
    console.log('[cookieUtils] Setting language cookie:', languageCookie)
    document.cookie = languageCookie

    // Також встановлюємо cookie 'lang' для HTML атрибуту (для браузера та SEO)
    const isoCode = languageToISO[language]
    const langCookie = `lang=${isoCode}; expires=${expiresString}; path=/; SameSite=Lax`
    console.log('[cookieUtils] Setting lang cookie:', langCookie)
    document.cookie = langCookie

    console.log('[cookieUtils] Cookies set. All cookies now:', document.cookie)
  },

  // Отримати мову з cookie для сервера (middleware)
  getLanguageFromCookie(cookieHeader: string | undefined): Language {
    if (!cookieHeader) {
      return Language.EN
    }

    const cookies = cookieHeader.split(';')
    const languageCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`)
    )

    if (languageCookie) {
      const language = languageCookie.split('=')[1]?.trim()
      if (Object.values(Language).includes(language as Language)) {
        return language as Language
      }
    }

    return Language.EN
  }
}
