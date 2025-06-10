import { useQuery } from '@tanstack/react-query'
import { userService } from '../services'

export function useProfileByNameSafe(name: string) {
	const { data: users, isLoading: isLoadingProfile } = useQuery({
		queryKey: ['profileByNameSafe ' + name],
		queryFn: () => userService.findProfileByNameSafe(name)
	})

	return { users, isLoadingProfile }
}
