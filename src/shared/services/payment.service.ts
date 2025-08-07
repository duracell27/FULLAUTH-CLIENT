import { TypeAddPaymentSchema } from '../schemas/createPayment.schema'
import { api } from '../utils/api'

class PaymentService {
	public async addPayment(body: TypeAddPaymentSchema) {
		const response = await api.post<boolean>('debts/pay-group', body)
		return response
	}

	public async deletePayment(groupId: string, creditorId: string, debtorId: string) {
		const response = await api.post<boolean>('debts/delete-payments', {groupId, creditorId, debtorId})
		return response
	}

}

export const paymentService = new PaymentService()
