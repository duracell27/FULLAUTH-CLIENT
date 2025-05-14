import { z } from 'zod'

export const newPasswordSchema = z.object({
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters'
	})
})

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>
