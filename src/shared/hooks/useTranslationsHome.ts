'use client'

import { Language } from '../types/user.types'
import { useState, useEffect } from 'react'
import { cookieUtils } from '../utils/cookie'

// Мапінг мов на ISO коди
const languageToLocale: Record<Language, string> = {
  EN: 'en',
  UK: 'uk',
  DE: 'de',
  ES: 'es', 
  FR: 'fr',
  CS: 'cs',
  PL: 'pl',
  TR: 'tr',
  HI: 'hi',
  ZH: 'zh'
}

// Кеш для перекладів
const messagesCache = new Map<string, Record<string, string>>()

// Функція для визначення мови браузера
const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return Language.EN
  }

  const browserLang = navigator.language.split('-')[0].toUpperCase()

  // Мапінг ISO кодів на наш enum
  const langMap: Record<string, Language> = {
    'EN': Language.EN,
    'UK': Language.UK,
    'UA': Language.UK, // Українська може бути як UK або UA
    'DE': Language.DE,
    'ES': Language.ES,
    'FR': Language.FR,
    'CS': Language.CS,
    'PL': Language.PL,
    'TR': Language.TR,
    'HI': Language.HI,
    'ZH': Language.ZH,
  }

  return langMap[browserLang] || Language.EN
}

// Завантажуємо переклади
const loadMessages = async (locale: string) => {
  // Перевіряємо кеш
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale)!
  }

  try {
    const messagesModule = await import(`../../locales/${locale}/settings.json`)
    const messages = messagesModule.default || messagesModule
    // Зберігаємо в кеш
    messagesCache.set(locale, messages)
    return messages
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error)
    // Fallback to English
    try {
      const fallbackMessages = await import(`../../locales/en/settings.json`)
      const messages = fallbackMessages.default || fallbackMessages
      // Зберігаємо в кеш
      messagesCache.set(locale, messages)
      return messages
    } catch (fallbackError) {
      console.error('Failed to load fallback messages:', fallbackError)
      return {}
    }
  }
}

export function useTranslationsHome() {
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null)

  // Завантажуємо мову з cookie та переклади при ініціалізації
  useEffect(() => {
    const loadLanguageAndMessages = async () => {
      setIsLoading(true)
      try {
        // Перевіряємо чи є cookie з мовою
        const cookies = typeof document !== 'undefined' ? document.cookie : ''
        const hasLanguageCookie = cookies.includes('language=')

        let languageToUse: Language

        if (!hasLanguageCookie) {
          // Якщо cookie немає - визначаємо мову з браузера
          const browserLanguage = getBrowserLanguage()
          console.log('[useTranslationsHome] No cookie found, detected browser language:', browserLanguage)
          languageToUse = browserLanguage
          // Встановлюємо cookie для наступних візитів
          cookieUtils.setLanguage(browserLanguage)
        } else {
          // Якщо cookie є - використовуємо його
          languageToUse = cookieUtils.getLanguage()
          console.log('[useTranslationsHome] Language from cookie:', languageToUse)
        }

        setCurrentLanguage(languageToUse)

        // Потім завантажуємо переклади для правильної мови
        const locale = languageToLocale[languageToUse]
        console.log('[useTranslationsHome] Loading locale:', locale)
        const loadedMessages = await loadMessages(locale)
        console.log('[useTranslationsHome] Loaded messages:', Object.keys(loadedMessages).length, 'keys')
        console.log('[useTranslationsHome] Sample translation (welcomeToLendower):', loadedMessages.welcomeToLendower)
        setMessages(loadedMessages)
      } catch (error) {
        console.error('useTranslationsHome - error loading messages:', error)
        setMessages({})
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguageAndMessages()
  }, [])

  // Функція для зміни мови
  const changeLanguage = (language: Language) => {
    console.log('[useTranslationsHome] changeLanguage called with:', language)
    setCurrentLanguage(language)
    cookieUtils.setLanguage(language)
    console.log('[useTranslationsHome] Cookie set, reloading page...')
    // Перезавантажуємо переклади для нової мови
    setIsLoading(true)

    // Плавне перезавантаження для оновлення всіх текстів
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  // Функція для отримання перекладу
  const t = (key: string): string => {
    if (isLoading) {
      return key // Повертаємо ключ поки завантажуємо
    }
    const translation = messages[key] || key
    return translation // Повертаємо переклад або ключ якщо не знайдено
  }

  return { t, changeLanguage, currentLanguage, isLoading }
}
