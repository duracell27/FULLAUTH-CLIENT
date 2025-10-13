import { useMutation, useQueryClient } from '@tanstack/react-query'
import { friendsService } from '../services/friends.service'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useTranslations } from './useTranslations'

export function useCancelFriendRequestMutation() {
	const { t } = useTranslations()

    const queryClient = useQueryClient()

	const {
		mutate: cancelFriendRequest,
		isPending: isLoadingCancelFriendRequest
	} = useMutation({
		mutationKey: ['cancel friend request'],
		mutationFn: (friendRequestId: string) =>
			friendsService.deleteFriendRequest(friendRequestId),
		onSuccess: () => {
			toast.success(t('friendRequestCancelled'))
            queryClient.invalidateQueries({queryKey: ['friends']})
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { cancelFriendRequest, isLoadingCancelFriendRequest }
}
