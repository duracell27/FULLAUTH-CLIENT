import { z } from 'zod'

export const searchUserSchema = z.object({
	name: z.string().min(1, {
		message: 'Name must be at least 1 characters'
	})
})

export type TypeSearchUserSchema = z.infer<typeof searchUserSchema>
