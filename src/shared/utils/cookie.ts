import { Language } from '../types'

const LANGUAGE_COOKIE_NAME = 'language'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 рік в секундах

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

    document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
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
