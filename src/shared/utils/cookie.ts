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

export const cookieUtils = {
  // Отримати мову з cookie
  getLanguage(): Language {
    if (typeof document === 'undefined') {
      return Language.EN // Fallback для сервера
    }

    const cookies = document.cookie.split(';')
    const languageCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`)
    )

    if (languageCookie) {
      const language = languageCookie.split('=')[1]?.trim()
      if (Object.values(Language).includes(language as Language)) {
        return language as Language
      }
    }

    return Language.EN // Fallback якщо немає cookie
  },

  // Встановити мову в cookie
  setLanguage(language: Language): void {
    if (typeof document === 'undefined') {
      return
    }

    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1) // 1 рік
    const expiresString = expires.toUTCString()

    // Встановлюємо cookie 'language' для нашого додатку
    const languageCookie = `${LANGUAGE_COOKIE_NAME}=${language}; expires=${expiresString}; path=/; SameSite=Lax`
    document.cookie = languageCookie

    // Також встановлюємо cookie 'lang' для HTML атрибуту (для браузера та SEO)
    const isoCode = languageToISO[language]
    const langCookie = `lang=${isoCode}; expires=${expiresString}; path=/; SameSite=Lax`
    document.cookie = langCookie
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
