import { useQuery } from '@tanstack/react-query'
import { cardRequestService } from '../services/cardRequest.service'

export const useCardRequestsSent = () => {
	const { data: sentRequests, isLoading: isLoadingSentRequests } = useQuery({
		queryKey: ['card-requests-sent'],
		queryFn: () => cardRequestService.getSentRequests(),
		staleTime: 0
	})

	return { sentRequests, isLoadingSentRequests }
}
