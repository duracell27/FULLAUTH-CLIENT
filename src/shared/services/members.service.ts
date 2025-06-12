import { TypeAddMemberToGroupSchema } from '../schemas/addMemberToGroup.schema'
import { IGroupMember, IUserGroup } from '../types'
import { api } from '../utils/api'

class MemberService {
	public async addMemberToGroup(body: TypeAddMemberToGroupSchema) {
		const response = await api.post<IGroupMember>('group-members/add', body)
		return response
	}

	public async getGroupsRequests() {
		const response = await api.get<IUserGroup[]>('group-members/requests')
		return response
	}

	public async patchAcceptGroupRequest(groupId: string) {
		const response = await api.patch(`group-members/requests/accept`, {
			groupId
		})
		return response
	}

	public async patchRejectGroupRequest(groupId: string) {
		const response = await api.patch(`group-members/requests/reject`, {
			groupId
		})
		return response
	}

	//  public async getSearched(userId: string) {
	//     const response = await api.get<IGroup>(`groups/${userId}`)
	//     return response
	// }
}

export const memberService = new MemberService()
