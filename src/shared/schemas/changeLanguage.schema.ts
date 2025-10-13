import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createChangeLanguageSchema = (t: (key: string) => string) => {
	return z.object({
		language: z.enum(
			['EN', 'UK', 'DE', 'ES', 'FR', 'CS', 'PL', 'TR', 'HI', 'ZH'],
			{
				errorMap: () => ({
					message: t('invalidLanguage')
				})
			}
		)
	})
}

// Для зворотної сумісності
export const changeLanguageSchema = z.object({
	language: z.enum(
		['EN', 'UK', 'DE', 'ES', 'FR', 'CS', 'PL', 'TR', 'HI', 'ZH'],
		{
				errorMap: () => ({
				message:
					'Language must be either EN or UK or DE or ES or FR or CS or PL or TR or HI or ZH'
			})
		}
	)
})

export type TypeChangeLanguageSchema = z.infer<typeof changeLanguageSchema>
