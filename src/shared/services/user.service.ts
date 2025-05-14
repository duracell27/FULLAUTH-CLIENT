import { TypeSettingsSchema } from '../schemas'
import { IUser } from '../types'
import { api } from '../utils/api'

class UserService {
	public async findProfile() {
		const response = await api.get<IUser>('user/profile')

		return response
	}

	public async updateProfile(body: TypeSettingsSchema) {
		const response = await api.patch<IUser>('user/profile', body)

		return response
	}
}

export const userService = new UserService()
