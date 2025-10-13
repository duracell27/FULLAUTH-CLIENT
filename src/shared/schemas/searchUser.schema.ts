import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createSearchUserSchema = (t: (key: string) => string) => {
	return z.object({
		name: z.string().min(1, {
			message: t('searchNameMinLength').replace('{min}', '1')
		})
	})
}

// Для зворотної сумісності
export const searchUserSchema = z.object({
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	})
})

export type TypeSearchUserSchema = z.infer<typeof searchUserSchema>
