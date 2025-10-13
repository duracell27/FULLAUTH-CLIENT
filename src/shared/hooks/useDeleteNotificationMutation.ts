import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'
import { useTranslations } from './useTranslations'

export function useDeleteNotificationMutation() {
	const { t } = useTranslations()
	const queryClient = useQueryClient()
	const {
		mutate: deleteNotification,
		isPending: isLoadingDeleteNotification
	} = useMutation({
		mutationKey: ['delete notification'],
		mutationFn: (notificationId: string) =>
			notificationsService.deleteNotification(notificationId),
		onSuccess: () => {
			toast.success(t('notificationDeletedSuccessfully'))
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { deleteNotification, isLoadingDeleteNotification }
}
