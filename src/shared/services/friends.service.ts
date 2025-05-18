import { ResponseIfriend } from '../types'
import { api } from '../utils/api'

class FriendsService {
	public async getFriends() {
		const response = await api.get<ResponseIfriend>('friends')

		return response
	}

    public async addFriend(friendId: string) {
        const response = await api.post(`friends/add`, {recieverUserId: friendId})

        return response
    }

	public async deleteFriendRequest(friendRequestId: string) {
		const response = await api.delete(`friends/${friendRequestId}`)

		return response
	}

    public async acceptFriendRequest(friendRequestId: string) {
        const response = await api.patch(`friends/accept`, {friendRequestId})

        return response
    }

    public async rejectFriendRequest(friendRequestId: string) {
        const response = await api.patch(`friends/reject`, {friendRequestId})

        return response
    }
}

export const friendsService = new FriendsService()
