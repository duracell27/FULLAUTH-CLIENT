import { useQuery } from '@tanstack/react-query'
import { notificationsService } from '../services/notifications.service'

export function useNotificationsUnread() {
	const { data: notificationsUnread, isLoading: isLoadingNotificationsUnread } = useQuery(
		{
			queryKey: ['notificationsUnread'],
			queryFn: () => notificationsService.getNotificationsUnread(),
			refetchInterval: 60000,
		}
	)

	return { notificationsUnread, isLoadingNotificationsUnread }
}
