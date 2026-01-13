'use client'

import { Language } from '../types/user.types'
import { useTranslationsHome } from '../hooks/useTranslationsHome'
import { useTranslations } from '../hooks/useTranslations'
import { useProfile } from '../hooks/useProfile'
import { useChangeLanguageMutation } from '../hooks/useChangeLanguageMutation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select'

const languageOptions = [
  { value: Language.EN, label: 'English', flag: '🇺🇸' },
  { value: Language.UK, label: 'Українська', flag: '🇺🇦' },
  { value: Language.DE, label: 'Deutsch', flag: '🇩🇪' },
  { value: Language.ES, label: 'Español', flag: '🇪🇸' },
  { value: Language.FR, label: 'Français', flag: '🇫🇷' },
  { value: Language.CS, label: 'Čeština', flag: '🇨🇿' },
  { value: Language.PL, label: 'Polski', flag: '🇵🇱' },
  { value: Language.TR, label: 'Türkçe', flag: '🇹🇷' },
  { value: Language.HI, label: 'हिन्दी', flag: '🇮🇳' },
  { value: Language.ZH, label: '中文', flag: '🇨🇳' },
]

export function LanguageSwitcher() {
  const { user, isLoadingProfile } = useProfile()
  const { changeLanguage: changeLanguageHome, currentLanguage: currentLanguageHome, isLoading: isLoadingHome } = useTranslationsHome()
  const { isLoading: isLoadingAuth } = useTranslations()
  const { changeLanguage: changeLanguageMutation, isLoadingChangeLanguage } = useChangeLanguageMutation()

  // Визначаємо, чи залогінений користувач
  const isLoggedIn = !!user && !isLoadingProfile

  // Для залогіненого користувача отримуємо поточну мову з профілю
  const currentLanguage = isLoggedIn ? (user?.language || Language.EN) : (currentLanguageHome || Language.EN)
  const isLoading = isLoggedIn ? isLoadingAuth : isLoadingHome

  // Функція зміни мови
  const handleLanguageChange = (language: Language) => {
    if (isLoggedIn) {
      // Якщо залогінений - викликаємо мутацію для зміни мови на бекенді
      changeLanguageMutation({ values: { language } })
    } else {
      // Якщо не залогінений - тільки змінюємо мову в куках
      changeLanguageHome(language)
    }
  }

  if (isLoading || isLoadingChangeLanguage) {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-40 h-10 bg-muted animate-pulse rounded-md flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  const currentOption = languageOptions.find(option => option.value === currentLanguage)

  return (
    <div className="flex flex-col items-center">
      <Select
        value={currentLanguage}
        onValueChange={(value: Language) => handleLanguageChange(value)}
      >
        <SelectTrigger className="w-40 !h-10 bg-primary text-primary-foreground">
          <SelectValue placeholder={currentOption ? `${currentOption.flag} ${currentOption.label}` : '🇺🇸 English'} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="">
              <span className="flex items-center gap-2">
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
