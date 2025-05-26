import { add } from 'date-fns'
import { z } from 'zod'

export const addGroupSchema = z.object({
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	}),
	avatarUrl: z.optional(z.string()),
	eventDate: z.optional(z.date())
})

export type TypeAddGroupSchema = z.infer<typeof addGroupSchema>
