import { z } from 'zod'

export const settingsSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	}),
	name: z.string().min(1, {
		message: 'Name is required'
	}),
	isTwoFactorEnabled: z.boolean()
})

export type TypeSettingsSchema = z.infer<typeof settingsSchema>
