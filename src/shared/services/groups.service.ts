import { TypeEditGroupSchema } from '../schemas'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'
import { IGroup, IUserGroupObject } from '../types'
import { api } from '../utils/api'

class GroupsService {
	public async addGroup(body: TypeAddGroupSchema) {
		const response = await api.post<IGroup>('groups/create', body)
		return response
	}

    public async editGroup(body: TypeEditGroupSchema) {
		const response = await api.patch<IGroup>('groups/update', body)
		return response
	}

    public async getGroups() {
        const response = await api.get<IUserGroupObject>('group-members')
        return response
    }

    public async deleteGroup(groupId: string) {
        const response = await api.delete<boolean>(`groups/${groupId}`)
        return response
    }

     public async getGroup(groupId: string) {
        const response = await api.get<IGroup>(`groups/${groupId}`)
        return response
    }
}

export const groupsService = new GroupsService()
