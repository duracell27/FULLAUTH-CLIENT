
import { z } from 'zod'

export const addPaymentSchema = z.object({
	amount: z.number().min(1, {
		message: 'Amount must be at least 1'
	}),
	groupId: z.string().min(1, {
		message: 'Group ID is required'
	}).uuid(),
	creditorId: z.string().min(1, {
		message: 'Creditor ID is required'
	}).uuid(),
	debtorId: z.string().min(1, {
		message: 'Debtor ID is required'
	}).uuid()
})

export type TypeAddPaymentSchema = z.infer<typeof addPaymentSchema>
