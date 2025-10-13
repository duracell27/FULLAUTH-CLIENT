import { z } from 'zod'

// Функція для створення схеми з перекладами
export const createExpenseSchema = (t: (key: string) => string) => {
	const payersSchema = z.object({
		userId: z.string().uuid({ message: t('userIdInvalid') }),
		amount: z.string().min(1, { message: t('amountRequired') })
	})

	const debtorsSchema = z.object({
		userId: z.string().uuid({ message: t('userIdInvalid') }),
		amount: z.string().optional(),
		percentage: z.string().optional(),
		shares: z.string().optional(),
		extraAmount: z.string().optional()
	})

	return z.object({
		description: z.string().min(1, {
			message: t('descriptionRequired')
		}),
		amount: z.string().min(1, {
			message: t('amountRequired')
		}),
		groupId: z.string().uuid({
			message: t('groupIdInvalid')
		}),
		splitType: z.enum(['EQUAL', 'CUSTOM', 'PERCENTAGE', 'SHARES', 'EXTRA']),
		photoUrl: z.string().optional(),
		date: z.optional(z.date()),
		payers: z.array(payersSchema),
		debtors: z.array(debtorsSchema)
	})
}

// Для зворотної сумісності - створюємо схему з англійськими повідомленнями
const payersSchema = z.object({
	userId: z.string().uuid({ message: 'Invalid user ID' }),
	amount: z.string().min(1, { message: 'Amount is required' })
})

const debtorsSchema = z.object({
	userId: z.string().uuid({ message: 'Invalid user ID' }),
	amount: z.string().optional(),
	percentage: z.string().optional(),
	shares: z.string().optional(),
	extraAmount: z.string().optional()
})

export const addExpenseSchema = z.object({
	description: z.string().min(1, {
		message: 'Description is required'
	}),
	amount: z.string().min(1, {
		message: 'Amount is required'
	}),
	groupId: z.string().uuid({
		message: 'Invalid group ID'
	}),
	splitType: z.enum(['EQUAL', 'CUSTOM', 'PERCENTAGE', 'SHARES', 'EXTRA']),
	photoUrl: z.string().optional(),
	date: z.optional(z.date()),
	payers: z.array(payersSchema),
	debtors: z.array(debtorsSchema)
})

// Тип після трансформації — для onSubmit
export type TypeAddExpenseForm = z.infer<typeof addExpenseSchema>

// Schema interfaces
interface IPayersSchema {
	userId: string
	amount: number
}

interface IDebtorsSchema {
	userId: string
	amount?: number
	percentage?: number
	shares?: number
	extraAmount?: number
}

export interface TypeAddExpenseFormNumber {
	description: string
	amount: number
	groupId: string
	splitType: 'EQUAL' | 'CUSTOM' | 'PERCENTAGE' | 'SHARES' | 'EXTRA'
	photoUrl?: string
	date?: Date
	payers: IPayersSchema[]
	debtors: IDebtorsSchema[]
}
