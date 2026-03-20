import { useQuery } from '@tanstack/react-query'
import { groupsService } from '../services'

export function usePublicGroup(groupId: string) {
	const { data: publicGroup, isLoading: isLoadingPublicGroup, isError: isErrorPublicGroup } = useQuery({
		queryKey: ['public-group', groupId],
		queryFn: () => groupsService.getPublicGroup(groupId),
		retry: false,
		staleTime: 0
	})

	return { publicGroup, isLoadingPublicGroup, isErrorPublicGroup }
}
