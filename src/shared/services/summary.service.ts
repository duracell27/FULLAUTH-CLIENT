import { TypeAddExpenseFormNumber } from '../schemas'
import { IExpense } from '../types'
import { ISummary } from '../types/summary.types'
import { api } from '../utils/api'

class SummaryService {
	public async settleUp(settlerUserId: string) {
		const response = await api.post<boolean>('summary/settle-up', {settlerUserId})
		return response
	}

    public async getSummary() {
        const response = await api.get<ISummary[]>(`summary`)
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

export const summaryService = new SummaryService()
