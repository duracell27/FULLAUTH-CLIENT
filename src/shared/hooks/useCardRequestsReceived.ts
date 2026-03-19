import { useQuery } from '@tanstack/react-query'
import { cardRequestService } from '../services/cardRequest.service'

export const useCardRequestsReceived = () => {
	const { data: receivedRequests, isLoading: isLoadingReceivedRequests } = useQuery({
		queryKey: ['card-requests-received'],
		queryFn: () => cardRequestService.getReceivedRequests(),
		staleTime: 0
	})

	return { receivedRequests, isLoadingReceivedRequests }
}
