import { useMutation, useQueryClient } from "@tanstack/react-query"
import { friendsService } from "../services/friends.service"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"

export function useRejectFriendRequestMutation() {
    const queryClient = useQueryClient()
    const {mutate: rejectFriendRequest, isPending: isLoadingRejectFriendRequest} = useMutation({
        mutationKey: ['reject friend request'],
        mutationFn: (friendRequestId: string) =>
            friendsService.rejectFriendRequest(friendRequestId),
        onSuccess: () => {
            toast.success('Friend request rejected')
            queryClient.invalidateQueries({queryKey: ['friends']})
        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {rejectFriendRequest, isLoadingRejectFriendRequest}
}