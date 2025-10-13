'use client'

import { Language } from '../types/user.types'
import { useState, useEffect } from 'react'
import { cookieUtils } from '../utils/cookie'
import { useProfile } from './useProfile'

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

export function useTranslationsGuest() {
  const { user, isLoadingProfile } = useProfile()
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.EN)
  
  const locale = languageToLocale[currentLanguage]

  // Завантажуємо мову з user.language або cookie
  useEffect(() => {
    const languageFromUser = user?.language
    const languageFromCookie = cookieUtils.getLanguage()
    const finalLanguage = languageFromUser || languageFromCookie
    
    
    if (finalLanguage !== currentLanguage) {
      setCurrentLanguage(finalLanguage)
    }
  }, [user?.language, currentLanguage])

  // Додатковий useEffect для перезавантаження при зміні currentLanguage
  useEffect(() => {
    if (currentLanguage !== Language.EN) {
      const loadMessagesForLanguage = async () => {
        setIsLoading(true)
        const loadedMessages = await loadMessages(languageToLocale[currentLanguage])
        setMessages(loadedMessages)
        setIsLoading(false)
      }
      loadMessagesForLanguage()
    }
  }, [currentLanguage])

  // Завантажуємо переклади при зміні мови
  useEffect(() => {
    const loadMessagesForLanguage = async () => {
      setIsLoading(true)
      const loadedMessages = await loadMessages(locale)
      setMessages(loadedMessages)
      setIsLoading(false)
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
    if (isLoading || isLoadingProfile) {
      return key // Повертаємо ключ поки завантажуємо
    }
    const translation = messages[key] || key
    return translation // Повертаємо переклад або ключ якщо не знайдено
  }

  return { t, changeLanguage, currentLanguage, isLoading }
}
