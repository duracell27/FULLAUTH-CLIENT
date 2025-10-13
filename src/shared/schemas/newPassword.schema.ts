import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createNewPasswordSchema = (t: (key: string) => string) => {
	return z.object({
		password: z.string().min(6, {
			message: t('passwordMinLength').replace('{min}', '6')
		})
	})
}

// Для зворотної сумісності
export const newPasswordSchema = z.object({
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters'
	})
})

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>
