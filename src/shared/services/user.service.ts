import { TypeSettingsSchema } from '../schemas'
import { TypeChangeLanguageSchema } from '../schemas/changeLanguage.schema'
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

	public async findProfileByNameSafe(name: string) {
		const response = await api.get<IUserSafe[]>(`user/by-name-safe/${name}`)

		return response
	}

	public async updateProfile(body: TypeSettingsSchema) {
		const response = await api.patch<IUser>('user/profile', body)

		return response
	}

	public async changeLanguage(body: TypeChangeLanguageSchema) {
		const response = await api.patch<IUser>('user/language', body)

		return response
	}
}

export const userService = new UserService()
