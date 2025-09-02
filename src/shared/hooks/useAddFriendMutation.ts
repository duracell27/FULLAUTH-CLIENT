import { useMutation, useQueryClient } from "@tanstack/react-query"
import { friendsService } from "../services/friends.service"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"
import { useRouter } from "next/navigation"

export function useAddFriendMutation() {
    const router  = useRouter()
    const queryClient = useQueryClient()
    const {mutate: addFriend, isPending: isLoadingAddFriend} = useMutation({
        mutationKey: ['add friend'],
        mutationFn: (userId: string) =>
            friendsService.addFriend(userId),
        onSuccess: () => {
            toast.success('Friend request sent')
            queryClient.invalidateQueries({queryKey: ['friends']})
            queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
            queryClient.invalidateQueries({queryKey: ['notifications']})
            router.push('/dashboard/settings/friends')
        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {addFriend, isLoadingAddFriend}
}