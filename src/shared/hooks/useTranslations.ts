'use client'

import { useProfile } from './useProfile'
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

// Функція для очищення кешу (для діагностики)
export const clearTranslationsCache = () => {
  messagesCache.clear()
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

export function useTranslations() {
  const { user } = useProfile()
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Пріоритет: user.language > cookie > EN
  const currentLanguage = user?.language || cookieUtils.getLanguage()
  const locale = languageToLocale[currentLanguage]
  
  useEffect(() => {
    const loadMessagesForLanguage = async () => {
      // Якщо переклади вже в кеші, завантажуємо миттєво
      if (messagesCache.has(locale)) {
        const cachedMessages = messagesCache.get(locale)!
        setMessages(cachedMessages)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const loadedMessages = await loadMessages(locale)
        setMessages(loadedMessages)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading messages:', error)
        setIsLoading(false)
      }
    }

    loadMessagesForLanguage()
  }, [locale, currentLanguage])

  // Функція для отримання перекладу
  const t = (key: string): string => {
    // Якщо переклади завантажені, використовуємо їх
    if (Object.keys(messages).length > 0) {
      return messages[key] || key
    }
    
    // Якщо переклади не завантажені, повертаємо ключ
    return key
  }

  return { t, isLoading, messages }
}
