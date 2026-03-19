import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardRequestService } from '../services/cardRequest.service'
import { toastMessageHandler } from '../utils'

export const useRevokeCardRequestMutation = () => {
	const queryClient = useQueryClient()

	const { mutate: revokeCardRequest, isPending: isRevokingCardRequest } = useMutation({
		mutationFn: (id: string) => cardRequestService.revokeRequest(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['card-requests-received'] })
			queryClient.invalidateQueries({ queryKey: ['card-requests-sent'] })
		},
		onError: toastMessageHandler
	})

	return { revokeCardRequest, isRevokingCardRequest }
}
