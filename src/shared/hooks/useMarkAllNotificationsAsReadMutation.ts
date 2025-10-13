import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'
import { useTranslations } from './useTranslations'

export function useMarkAllNotificationsAsReadMutation() {
	const { t } = useTranslations()
	const queryClient = useQueryClient()
	const {
		mutate: markAllNotificationsAsRead,
		isPending: isLoadingMarkAllNotificationsAsRead
	} = useMutation({
		mutationKey: ['mark all notifications as read'],
		mutationFn: () => notificationsService.markAllNotificationsAsRead(),
		onSuccess: () => {
			toast.success(t('allNotificationsMarkedAsRead'))
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { markAllNotificationsAsRead, isLoadingMarkAllNotificationsAsRead }
}
