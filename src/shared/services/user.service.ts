import { TypeSettingsSchema } from '../schemas'
import { IUser, IUserSafe } from '../types'
import { api } from '../utils/api'

class UserService {
	public async findProfile() {
		const response = await api.get<IUser>('user/profile')

		return response
	}

	public async findProfileSafe(userId: string) {
		const response = await api.get<IUserSafe>(`user/by-id-safe/${userId}`)

		return response
	}

	public async updateProfile(body: TypeSettingsSchema) {
		const response = await api.patch<IUser>('user/profile', body)

		return response
	}
}

export const userService = new UserService()
