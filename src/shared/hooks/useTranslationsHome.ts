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
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.EN)
  
  const locale = languageToLocale[currentLanguage]

  // Завантажуємо мову з cookie при ініціалізації
  useEffect(() => {
    const languageFromCookie = cookieUtils.getLanguage()
    setCurrentLanguage(languageFromCookie)
  }, [])

  // Завантажуємо переклади при зміні мови
  useEffect(() => {
    const loadMessagesForLanguage = async () => {
      setIsLoading(true)
      try {
        const loadedMessages = await loadMessages(locale)
        setMessages(loadedMessages)
      } catch (error) {
        console.error('useTranslationsHome - error loading messages:', error)
        setMessages({})
      } finally {
        setIsLoading(false)
      }
    }

    loadMessagesForLanguage()
  }, [locale])

  // Функція для зміни мови
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    cookieUtils.setLanguage(language)
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
