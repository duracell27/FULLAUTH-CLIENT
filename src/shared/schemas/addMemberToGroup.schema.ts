import { add } from 'date-fns'
import { z } from 'zod'

export const addMemberToGroup = z.object({
	groupId: z.string().min(1, {
		message: 'Group id must be at least 1 characters'
	}),
	userId: z.string().min(1, {
		message: 'Reciever id must be at least 1 characters'
	}),

})

export type TypeAddMemberToGroupSchema = z.infer<typeof addMemberToGroup>
