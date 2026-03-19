import { api } from '../utils/api'
import { IReceivedCardRequest, ISentCardRequest } from '../types/cardRequest.types'

class CardRequestService {
	public async sendRequest(targetId: string) {
		return await api.post('card-requests', { targetId })
	}

	public async getSentRequests() {
		return await api.get<ISentCardRequest[]>('card-requests/sent')
	}

	public async getReceivedRequests() {
		return await api.get<IReceivedCardRequest[]>('card-requests/received')
	}

	public async updateRequest(id: string, status: 'APPROVED' | 'DENIED') {
		return await api.patch(`card-requests/${id}`, { status })
	}

	public async revokeRequest(id: string) {
		return await api.delete(`card-requests/${id}/revoke`)
	}
}

export const cardRequestService = new CardRequestService()
