import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardRequestService } from '../services/cardRequest.service'
import { toastMessageHandler } from '../utils'

export const useUpdateCardRequestMutation = () => {
	const queryClient = useQueryClient()

	const { mutate: updateCardRequest, isPending: isUpdatingCardRequest } = useMutation({
		mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'DENIED' }) =>
			cardRequestService.updateRequest(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['card-requests-received'] })
		},
		onError: toastMessageHandler
	})

	return { updateCardRequest, isUpdatingCardRequest }
}
