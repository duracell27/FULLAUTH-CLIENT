import { useQuery } from '@tanstack/react-query'
import { userService } from '../services'

export function useProfileSafe(userId: string) {
	const { data: user, isLoading: isLoadingProfile } = useQuery({
		queryKey: ['profileSafe'],
		queryFn: () => userService.findProfileSafe(userId)
	})

	return { user, isLoadingProfile }
}
