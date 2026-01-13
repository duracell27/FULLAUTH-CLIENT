import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createSettingsSchema = (t: (key: string) => string) => {
	return z.object({
		email: z.string().email({
			message: t('invalidEmail')
		}),
		name: z.string().min(1, {
			message: t('nameRequired')
		}),
		isTwoFactorEnabled: z.boolean(),
		picture: z.string().optional()
	})
}

// Для зворотної сумісності
export const settingsSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	}),
	name: z.string().min(1, {
		message: 'Name is required'
	}),
	isTwoFactorEnabled: z.boolean(),
	picture: z.string().optional()
})

export type TypeSettingsSchema = z.infer<typeof settingsSchema>
