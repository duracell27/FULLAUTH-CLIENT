import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createRegisterSchema = (t: (key: string) => string) => {
	return z
		.object({
			name: z
				.string()
				.min(1, {
					message: t('nameRequired')
				})
				.max(50),
			email: z.string().email({
				message: t('invalidEmail')
			}),
			password: z.string().min(6, {
				message: t('passwordMinLength').replace('{min}', '6')
			}),
			passwordRepeat: z.string().min(6, {
				message: t('passwordMinLength').replace('{min}', '6')
			})
		})
		.refine(data => data.password === data.passwordRepeat, {
			message: t('passwordsDoNotMatch'),
			path: ['passwordRepeat']
		})
}

// Для зворотної сумісності
export const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, {
				message: 'Name is required'
			})
			.max(50),
		email: z.string().email({
			message: 'Invalid email address'
		}),
		password: z.string().min(6, {
			message: 'Password must be at least 6 characters'
		}),
		passwordRepeat: z.string().min(6, {
			message: 'Password must be at least 6 characters'
		})
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Passwords do not match',
		path: ['passwordRepeat']
	})

export type TypeRegisterSchema = z.infer<typeof registerSchema>
