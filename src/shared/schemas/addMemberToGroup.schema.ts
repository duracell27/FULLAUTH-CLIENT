import { add } from 'date-fns'
import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createAddMemberToGroupSchema = (t: (key: string) => string) => {
	return z.object({
		groupId: z.string().min(1, {
			message: t('groupMinLength').replace('{min}', '1')
		}),
		userId: z.string().min(1, {
			message: t('receiverMinLength').replace('{min}', '1')
		}),
	})
}

// Для зворотної сумісності
export const addMemberToGroup = z.object({
	groupId: z.string().min(1, {
		message: 'Group id must be at least 1 characters'
	}),
	userId: z.string().min(1, {
		message: 'Reciever id must be at least 1 characters'
	}),
})

export type TypeAddMemberToGroupSchema = z.infer<typeof addMemberToGroup>
