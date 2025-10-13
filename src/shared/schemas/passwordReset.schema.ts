import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createPasswordResetSchema = (t: (key: string) => string) => {
	return z.object({
		email: z.string().email({
			message: t('invalidEmail')
		})
	})
}

// Для зворотної сумісності
export const resetPasswordSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	})
})

export type TypePasswordResetSchema = z.infer<typeof resetPasswordSchema>
