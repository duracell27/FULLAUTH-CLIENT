import { TypeAddExpenseFormNumber } from '../schemas'
import { IExpense } from '../types'
import { api } from '../utils/api'

class ExpenseService {
	public async addExpense(body: TypeAddExpenseFormNumber) {
		const response = await api.post<IExpense>('expenses/add', body)
		return response
	}

    public async getExpense(expenseId: string) {
        const response = await api.get<IExpense>(`expenses/${expenseId}`)
        return response
    }

    public async deleteExpense(expenseId: string) {
        const response = await api.delete<boolean>(`expenses/${expenseId}`)
        return response
    }

    

    public async getExpenseFormData(expenseId: string) {
        const response = await api.get<TypeAddExpenseFormNumber>(`expenses/${expenseId}/form-data`)
        return response
    }

   public async editExpense(body: TypeAddExpenseFormNumber, expenseId: string) {
    const response = await api.put<IExpense>(`expenses/${expenseId}`, body)
    return response
   }
}

export const expenseService = new ExpenseService()
