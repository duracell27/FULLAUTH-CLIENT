import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'

export function useDeleteNotificationMutation() {
	const queryClient = useQueryClient()
	const {
		mutate: deleteNotification,
		isPending: isLoadingDeleteNotification
	} = useMutation({
		mutationKey: ['delete notification'],
		mutationFn: (notificationId: string) =>
			notificationsService.deleteNotification(notificationId),
		onSuccess: () => {
			toast.success('Notification deleted successfully')
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { deleteNotification, isLoadingDeleteNotification }
}
