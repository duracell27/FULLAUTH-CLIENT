import { NotificationResponse } from '../types'
import { api } from '../utils/api'

class NotificationsService {
	public async getNotificationsUnread() {
		const response = await api.get<NotificationResponse[]>('notifications/unread')
		return response
	}

	public async getNotifications() {
		const response = await api.get<NotificationResponse[]>('notifications')
		return response
	}

	public async markAllNotificationsAsRead() {
		const response = await api.patch('notifications/mark-all-read')
		return response
	}

	public async markNotificationAsRead(notificationId: string) {
		const response = await api.patch(`notifications/${notificationId}/read`)
		return response
	}

	public async deleteNotification(notificationId: string) {
		const response = await api.delete(`notifications/${notificationId}`)
		return response
	}

	public async deleteAllNotifications() {
		const response = await api.delete('notifications/all')
		return response
	}

	// public async deletePayment(groupId: string, creditorId: string, debtorId: string) {
	// 	const response = await api.post<boolean>('debts/delete-payments', {groupId, creditorId, debtorId})
	// 	return response
	// }
}

export const notificationsService = new NotificationsService()
