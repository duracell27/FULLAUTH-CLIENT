import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'
import { useTranslations } from './useTranslations'

export function useMarkNotificationAsReadMutation() {
	const { t } = useTranslations()
	const queryClient = useQueryClient()
	const {
		mutate: markNotificationAsRead,
		isPending: isLoadingMarkNotificationAsRead
	} = useMutation({
		mutationKey: ['mark notification as read'],
		mutationFn: (notificationId: string) => notificationsService.markNotificationAsRead(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { markNotificationAsRead, isLoadingMarkNotificationAsRead }
}
