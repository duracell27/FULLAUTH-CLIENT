import { TypeAddMemberToGroupSchema } from '../schemas/addMemberToGroup.schema'
import { IGroupMember } from '../types'
import { api } from '../utils/api'

class MemberService {
	public async addMemberToGroup(body: TypeAddMemberToGroupSchema) {
		const response = await api.post<IGroupMember>('group-members/add', body)
		return response
	}

	//  public async getSearched(userId: string) {
	//     const response = await api.get<IGroup>(`groups/${userId}`)
	//     return response
	// }
}

export const memberService = new MemberService()
