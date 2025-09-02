import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'

export function useMarkAllNotificationsAsReadMutation() {
	const queryClient = useQueryClient()
	const {
		mutate: markAllNotificationsAsRead,
		isPending: isLoadingMarkAllNotificationsAsRead
	} = useMutation({
		mutationKey: ['mark all notifications as read'],
		mutationFn: () => notificationsService.markAllNotificationsAsRead(),
		onSuccess: () => {
			toast.success('All notifications marked as read')
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { markAllNotificationsAsRead, isLoadingMarkAllNotificationsAsRead }
}
