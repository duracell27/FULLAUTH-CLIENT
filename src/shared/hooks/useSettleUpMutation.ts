import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastMessageHandler } from "../utils";
import { toast } from "sonner";
import { summaryService } from "../services/summary.service";
import { useTranslations } from './useTranslations'

export function useSettleUpMutation() {
	const { t } = useTranslations()
    // const router = useRouter()

    const queryClient = useQueryClient()

    const {mutate: settleUp, isPending: isLoadingSettleUp} = useMutation({
        mutationKey: ['settleUp'],
        mutationFn: (settlerUserId: string) => summaryService.settleUp(settlerUserId),
        onSuccess: () => {
            toast.success(t('youHaveBeenSettledUpSuccessfully'))
            queryClient.invalidateQueries({queryKey: ['summary']})
            queryClient.invalidateQueries({queryKey: ['groups']})
        },
        onError: (error) => {
            toastMessageHandler(error)
        }
    })

    return {settleUp, isLoadingSettleUp}
}