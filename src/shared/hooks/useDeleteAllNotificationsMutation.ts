import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { notificationsService } from '../services/notifications.service'
import { useTranslations } from './useTranslations'

export function useDeleteAllNotificationsMutation() {
	const { t } = useTranslations()
	const queryClient = useQueryClient()
	const {
		mutate: deleteAllNotifications,
		isPending: isLoadingDeleteAllNotifications
	} = useMutation({
		mutationKey: ['delete all notifications'],
		mutationFn: () => notificationsService.deleteAllNotifications(),
		onSuccess: () => {
			toast.success(t('allNotificationsDeletedSuccessfully'))
			queryClient.invalidateQueries({ queryKey: ['notificationsUnread'] })
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { deleteAllNotifications, isLoadingDeleteAllNotifications }
}
