export type CardRequestStatus = 'PENDING' | 'APPROVED' | 'DENIED'

export interface ISentCardRequest {
	id: string
	requesterId: string
	targetId: string
	status: CardRequestStatus
	createdAt: string
	target: {
		id: string
		displayName: string
		picture: string | null
	}
}

export interface IReceivedCardRequest {
	id: string
	requesterId: string
	targetId: string
	status: CardRequestStatus
	createdAt: string
	requester: {
		id: string
		displayName: string
		picture: string | null
	}
}
