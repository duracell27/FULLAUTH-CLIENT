
import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createGroupSchema = (t: (key: string) => string) => {
	return z.object({
		name: z.string().min(1, {
			message: t('groupNameMinLength').replace('{min}', '1')
		}),
		avatarUrl: z.optional(z.string()),
		eventDate: z.optional(z.date()),
		isLocked: z.boolean().default(false),
		isFinished: z.boolean().default(false)
	})
}

// Для зворотної сумісності
export const addGroupSchema = z.object({
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	}),
	avatarUrl: z.optional(z.string()),
	eventDate: z.optional(z.date()),
	isLocked: z.boolean().default(false),
	isFinished: z.boolean().default(false)
})

export type TypeAddGroupSchema = z.infer<typeof addGroupSchema>
