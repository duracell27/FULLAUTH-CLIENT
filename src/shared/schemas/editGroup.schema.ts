import { group } from 'console'
import { add } from 'date-fns'
import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createEditGroupSchema = (t: (key: string) => string) => {
	return z.object({
		groupId: z.string(),
		name: z.string().min(1, {
			message: t('groupNameMinLength').replace('{min}', '1')
		}),
		avatarUrl: z.optional(z.string()),
		eventDate: z.optional(z.date()),
		isLocked: z.boolean(),
		isFinished: z.boolean()
	})
}

// Для зворотної сумісності
export const editGroupSchema = z.object({
	groupId: z.string(),
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	}),
	avatarUrl: z.optional(z.string()),
	eventDate: z.optional(z.date()),
	isLocked: z.boolean(),
	isFinished: z.boolean()
})

export type TypeEditGroupSchema = z.infer<typeof editGroupSchema>
