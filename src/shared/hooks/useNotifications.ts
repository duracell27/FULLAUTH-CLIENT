import { useQuery } from '@tanstack/react-query'
import { notificationsService } from '../services/notifications.service'

export function useNotifications() {
	const { data: notifications, isLoading: isLoadingNotifications } = useQuery(
		{
			queryKey: ['notifications'],
			queryFn: () => notificationsService.getNotifications(),
			refetchInterval: 60000,
			refetchOnWindowFocus: true,
			staleTime: 0,
		}
	)

	return { notifications, isLoadingNotifications }
}
