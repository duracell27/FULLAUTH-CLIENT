import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"
import { memberService } from "../services/members.service"

export function useRejectGroupRequestMutation() {
    const queryClient = useQueryClient()

    const {mutate: rejectGroupRequest, isPending: isLoadingRejectGroupRequest} = useMutation({
        mutationKey: ['reject group request'],
        mutationFn: (groupId: string) =>
            memberService.patchRejectGroupRequest(groupId),
        onSuccess: () => {
            toast.success('Group request rejected')
            queryClient.invalidateQueries({queryKey: ['groups requests']})

        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {rejectGroupRequest, isLoadingRejectGroupRequest}
}