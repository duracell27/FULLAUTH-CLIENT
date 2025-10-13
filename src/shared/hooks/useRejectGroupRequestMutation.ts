import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { toastMessageHandler } from "../utils"
import { memberService } from "../services/members.service"
import { useTranslations } from './useTranslations'

export function useRejectGroupRequestMutation() {
	const { t } = useTranslations()
    const queryClient = useQueryClient()

    const {mutate: rejectGroupRequest, isPending: isLoadingRejectGroupRequest} = useMutation({
        mutationKey: ['reject group request'],
        mutationFn: (groupId: string) =>
            memberService.patchRejectGroupRequest(groupId),
        onSuccess: () => {
            toast.success(t('groupRequestRejected'))
            queryClient.invalidateQueries({queryKey: ['groups requests']})

        },
        onError: error => {
            toastMessageHandler(error)
        }
    })

    return {rejectGroupRequest, isLoadingRejectGroupRequest}
}