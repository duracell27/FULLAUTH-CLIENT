
import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createPaymentSchema = (t: (key: string) => string) => {
	return z.object({
		amount: z.number().min(1, {
			message: t('amountMinValue').replace('{min}', '1')
		}),
		groupId: z.string().min(1, {
			message: t('groupIdInvalid')
		}).uuid(),
		creditorId: z.string().min(1, {
			message: t('creditorIdRequired')
		}).uuid(),
		debtorId: z.string().min(1, {
			message: t('debtorIdRequired')
		}).uuid()
	})
}

// Для зворотної сумісності
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
