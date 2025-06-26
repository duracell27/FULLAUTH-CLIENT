import { TypeAddExpenseForm, TypeAddExpenseFormNumber, TypeEditGroupSchema } from '../schemas'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'
import { IExpense, IGroup, IUserGroup, ResponseIfriend } from '../types'
import { api } from '../utils/api'

class ExpenseService {
	public async addExpense(body: TypeAddExpenseFormNumber) {
		const response = await api.post<IExpense>('expenses/add', body)
		return response
	}

    // public async editGroup(body: TypeEditGroupSchema) {
	// 	const response = await api.patch<IGroup>('groups/update', body)
	// 	return response
	// }

    // public async getGroups() {
    //     const response = await api.get<IUserGroup[]>('group-members')
    //     return response
    // }

    

    //  public async getGroup(groupId: string) {
    //     const response = await api.get<IGroup>(`groups/${groupId}`)
    //     return response
    // }
}

export const expenseService = new ExpenseService()
