import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createLoginSchema = (t: (key: string) => string) => {
	return z.object({
		email: z.string().email({
			message: t('invalidEmail')
		}),
		password: z.string().min(1, {
			message: t('passwordRequired')
		}),
		code: z.optional(z.string())
	})
}

// Для зворотної сумісності
export const loginSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	}),
	password: z.string().min(1, {
		message: 'Password is required'
	}),
	code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof loginSchema>
