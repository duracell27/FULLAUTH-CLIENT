import { IGroup } from './groupe.types'
import { IUser } from './user.types'

// Enums (тільки потрібні для Expense)
export enum SplitType {
	EQUAL = 'EQUAL',
	CUSTOM = 'CUSTOM',
	PERCENTAGE = 'PERCENTAGE',
	SHARES = 'SHARES',
	EXTRA = 'EXTRA'
}

export enum DebtStatus {
	PENDING = 'PENDING',
	SETTLED = 'SETTLED'
}

// Base Expense interface
export interface IExpense {
	id: string
	groupId: string
	creatorId: string
	amount: number
	description: string
	photoUrl: string | null
	splitType: 'EQUAL' | 'CUSTOM' | 'PERCENTAGE' | 'SHARES' | 'EXTRA'
    date: Date
	createdAt: Date
	updatedAt: Date
	group: IGroup
	creator: IUser
	payers: IExpensePayment[]
	splits: IDebt[]
	userBalance: number
}

export interface IExpensePayment {
	id: string
	expenseId: string
	payerId: string
	amount: number
	createdAt: Date
	expense: IExpense
	payer: IUser
}

export interface IDebt {
	id: string
	expenseId: string
	debtorId: string
	creditorId: string
	amount: number
	remaining: number
	percentage: number | null
	shares: number | null
	extraAmount: number | null
	status: DebtStatus
	createdAt: Date
	updatedAt: Date
	expense: IExpense
	debtor: IUser
	creditor: IUser
	payments: IDebtPayment[]
}

export interface IDebtPayment {
	id: string
	debtId: string
	amount: number
	createdAt: Date
	debt: IDebt
}
