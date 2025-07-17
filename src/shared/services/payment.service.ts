import { TypeAddExpenseFormNumber } from '../schemas'
import { TypeAddPaymentSchema } from '../schemas/createPayment.schema'
import { IExpense } from '../types'
import { api } from '../utils/api'

class PaymentService {
	public async addPayment(body: TypeAddPaymentSchema) {
		const response = await api.post<boolean>('debts/pay-group', body)
		return response
	}

	// public async getExpense(expenseId: string) {
	// 	const response = await api.get<IExpense>(`expenses/${expenseId}`)
	// 	return response
	// }

}

export const paymentService = new PaymentService()
