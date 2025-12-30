import { TypeEditGroupSchema } from '../schemas'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'
import { IGroup } from '../types'
import { IUserGroup } from '../types/groupe.types'
import { api } from '../utils/api'

class GroupsService {
        public async addGroup(body: TypeAddGroupSchema) {
            const response = await api.post<IGroup>('groups/create', body)
            return response
        }

    public async addPersonalGroup(userId: string) {
        const response = await api.post<IGroup>(`groups/create-personal`, { userId })
        return response
    }

    public async editGroup(body: TypeEditGroupSchema) {
		const response = await api.patch<IGroup>('groups/update', body)
		return response
	}

    public async getGroups({ type, limit = 10, offset = 0 }: { type: 'finished' | 'active', limit?: number, offset?: number }) {
        const response = await api.get<{ groups: IUserGroup[], activeCount: number, finishedCount: number }>(`group-members`, {
            params: { type, limit, offset }
        })
        return response
    }

    public async getPersonalGroups({ type, limit = 10, offset = 0 }: { type: 'finished' | 'active', limit?: number, offset?: number }) {
        const response = await api.get<{ groups: IUserGroup[], activeCount: number, finishedCount: number }>(`group-members/personal`, {
            params: { type, limit, offset }
        })
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
