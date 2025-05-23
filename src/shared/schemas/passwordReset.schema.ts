import { z } from 'zod'

export const resetPasswordSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	})
})

export type TypePasswordResetSchema = z.infer<typeof resetPasswordSchema>
