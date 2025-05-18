import { useMutation, useQueryClient } from '@tanstack/react-query'
import { friendsService } from '../services/friends.service'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'

export function useCancelFriendRequestMutation() {

    const queryClient = useQueryClient()

	const {
		mutate: cancelFriendRequest,
		isPending: isLoadingCancelFriendRequest
	} = useMutation({
		mutationKey: ['cancel friend request'],
		mutationFn: (friendRequestId: string) =>
			friendsService.deleteFriendRequest(friendRequestId),
		onSuccess: () => {
			toast.success('Friend request cancelled')
            queryClient.invalidateQueries({queryKey: ['friends']})
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { cancelFriendRequest, isLoadingCancelFriendRequest }
}
