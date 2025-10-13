import { useTranslations } from '../hooks/useTranslations'

// Функція для створення перекладених повідомлень Zod
export const createZodTranslations = (t: (key: string) => string) => {
  return {
    // Загальні повідомлення
    required: (field: string) => t(`${field}Required`),
    minLength: (field: string, min: number) => t(`${field}MinLength`).replace('{min}', min.toString()),
    maxLength: (field: string, max: number) => t(`${field}MaxLength`).replace('{max}', max.toString()),
    email: () => t('invalidEmail'),
    uuid: (field: string) => t(`${field}Invalid`),
    passwordsMatch: () => t('passwordsDoNotMatch'),
    
    // Специфічні повідомлення для полів
    nameRequired: () => t('nameRequired'),
    emailRequired: () => t('emailRequired'),
    passwordRequired: () => t('passwordRequired'),
    passwordMinLength: (min: number) => t('passwordMinLength').replace('{min}', min.toString()),
    passwordRepeatRequired: () => t('passwordRepeatRequired'),
    
    // Повідомлення для витрат
    descriptionRequired: () => t('descriptionRequired'),
    amountRequired: () => t('amountRequired'),
    groupIdInvalid: () => t('groupIdInvalid'),
    userIdInvalid: () => t('userIdInvalid'),
    
    // Повідомлення для груп
    groupNameRequired: () => t('groupNameRequired'),
    groupNameMinLength: (min: number) => t('groupNameMinLength').replace('{min}', min.toString()),
  }
}

// Хук для отримання перекладених повідомлень Zod
export const useZodTranslations = () => {
  const { t } = useTranslations()
  return createZodTranslations(t)
}
