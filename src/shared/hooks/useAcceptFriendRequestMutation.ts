import { useMutation, useQueryClient } from "@tanstack/react-query"
import { friendsService } from "../services/friends.service"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"

export function useAcceptFriendRequestMutation() {
    const queryClient = useQueryClient()
    const {mutate: acceptFriendRequest, isPending: isLoadingAcceptFriendRequest} = useMutation({
        mutationKey: ['accept friend request'],
        mutationFn: (friendRequestId: string) =>
            friendsService.acceptFriendRequest(friendRequestId),
        onSuccess: () => {
            toast.success('Friend request accepted successfully')
            queryClient.invalidateQueries({queryKey: ['friends']})
        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {acceptFriendRequest, isLoadingAcceptFriendRequest}
}