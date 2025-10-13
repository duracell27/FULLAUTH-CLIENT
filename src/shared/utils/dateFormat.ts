import { format } from 'date-fns'
import { uk, enUS, de, es, fr, cs, pl, tr, hi, zhCN } from 'date-fns/locale'
import { Language } from '../types/user.types'

// Мапінг мов на локалі date-fns
const dateLocales: Record<Language, any> = {
  [Language.UK]: uk,
  [Language.EN]: enUS,
  [Language.DE]: de,
  [Language.ES]: es,
  [Language.FR]: fr,
  [Language.CS]: cs,
  [Language.PL]: pl,
  [Language.TR]: tr,
  [Language.HI]: hi,
  [Language.ZH]: zhCN,
}

/**
 * Форматує дату з підтримкою локалізації
 * @param date - дата для форматування
 * @param formatStr - рядок формату (наприклад, 'PP', 'dd.MM.yyyy')
 * @param language - мова для локалізації
 * @returns відформатована дата
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string,
  language: Language = Language.EN
): string {
  // Валідація вхідних даних
  if (!date) {
    return ''
  }

  let dateObj: Date | null = null
  
  try {
    // Спробуємо створити Date об'єкт
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date)
    } else {
      return ''
    }

    // Перевіряємо, чи дата валідна
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to formatDate:', date)
      return ''
    }

    const locale = dateLocales[language] || enUS
    return format(dateObj, formatStr, { locale })
  } catch (error) {
    console.error('Error formatting date:', error)
    // Fallback to default formatting without locale
    try {
      if (dateObj && !isNaN(dateObj.getTime())) {
        return format(dateObj, formatStr)
      }
      return ''
    } catch (fallbackError) {
      console.error('Fallback formatting also failed:', fallbackError)
      return ''
    }
  }
}

/**
 * Форматує дату в короткому форматі (dd.MM.yyyy) з локалізацією
 */
export function formatDateShort(
  date: Date | string | number,
  language: Language = Language.EN
): string {
  return formatDate(date, 'dd.MM.yyyy', language)
}

export function formatDateFull(
  date: Date | string | number,
  language: Language = Language.EN
): string {
  return formatDate(date, 'PP', language)
}
