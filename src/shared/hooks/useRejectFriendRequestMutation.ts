import { useMutation, useQueryClient } from "@tanstack/react-query"
import { friendsService } from "../services/friends.service"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"
import { useTranslations } from './useTranslations'

export function useRejectFriendRequestMutation() {
	const { t } = useTranslations()
    const queryClient = useQueryClient()
    const {mutate: rejectFriendRequest, isPending: isLoadingRejectFriendRequest} = useMutation({
        mutationKey: ['reject friend request'],
        mutationFn: (friendRequestId: string) =>
            friendsService.rejectFriendRequest(friendRequestId),
        onSuccess: () => {
            toast.success(t('friendRequestRejected'))
            queryClient.invalidateQueries({queryKey: ['friends']})
        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {rejectFriendRequest, isLoadingRejectFriendRequest}
}