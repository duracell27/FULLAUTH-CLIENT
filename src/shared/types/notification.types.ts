// Типи для нотифікацій
export type NotificationType =
	| 'DEBT_SETTLED'
	| 'FRIEND_REQUEST'
	| 'GROUP_INVITATION'
	| 'EXPENSE_ADDED'
	| 'DEBT_CREATED'
	| 'USER_REMOVED_FROM_GROUP'
	| 'CARD_REQUEST'
	| 'CARD_REQUEST_APPROVED'
	| 'CARD_REQUEST_DENIED'
	| 'GROUP_JOIN_REQUEST'
	| 'GROUP_JOIN_REQUEST_ACCEPTED'
	| 'GROUP_JOIN_REQUEST_REJECTED'

// Основна DTO для нотифікації
export interface NotificationResponse {
	id: string
	userId: string
	type: NotificationType
	title: string
	message: string
	isRead: boolean
	createdAt: Date

	// Деталі для різних типів нотифікацій
	relatedUserId?: string
	relatedGroupId?: string
	relatedExpenseId?: string
	relatedDebtId?: string

	// Додаткові дані
	metadata?: Record<string, string | number | boolean>
}
