import { group } from 'console'
import { add } from 'date-fns'
import { z } from 'zod'

export const editGroupSchema = z.object({
	groupId: z.string(),
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	}),
	avatarUrl: z.optional(z.string()),
	eventDate: z.optional(z.date())
})

export type TypeEditGroupSchema = z.infer<typeof editGroupSchema>
