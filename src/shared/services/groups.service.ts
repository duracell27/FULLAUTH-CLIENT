import { TypeAddGroupSchema } from '../schemas/createGroup.schema'
import { IGroup, IUserGroup, ResponseIfriend } from '../types'
import { api } from '../utils/api'

class GroupsService {
	public async addGroup(body: TypeAddGroupSchema) {
		const response = await api.post<IGroup>('groups/create', body)
		return response
	}

    public async getGroups() {
        const response = await api.get<IUserGroup[]>('group-members')
        return response
    }
}

export const groupsService = new GroupsService()
