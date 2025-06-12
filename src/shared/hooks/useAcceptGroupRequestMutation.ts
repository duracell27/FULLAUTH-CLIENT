import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"
import { memberService } from "../services/members.service"

export function useAcceptGroupRequestMutation() {
    const queryClient = useQueryClient()

    const {mutate: acceptGroupRequest, isPending: isLoadingAcceptGroupRequest} = useMutation({
        mutationKey: ['accept group request'],
        mutationFn: (groupId: string) =>
            memberService.patchAcceptGroupRequest(groupId),
        onSuccess: () => {
            toast.success('Group request accepted successfully')
            queryClient.invalidateQueries({queryKey: ['groups']})
            queryClient.invalidateQueries({queryKey: ['groups requests']})

        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {acceptGroupRequest, isLoadingAcceptGroupRequest}
}