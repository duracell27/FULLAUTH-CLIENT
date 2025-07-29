import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastMessageHandler } from "../utils";
import { toast } from "sonner";
import { summaryService } from "../services/summary.service";

export function useSettleUpMutation() {
    // const router = useRouter()

    const queryClient = useQueryClient()

    const {mutate: settleUp, isPending: isLoadingSettleUp} = useMutation({
        mutationKey: ['settleUp'],
        mutationFn: (settlerUserId: string) => summaryService.settleUp(settlerUserId),
        onSuccess: () => {
            toast.success('You have been settled up successfully')
            queryClient.invalidateQueries({queryKey: ['summary']})
        },
        onError: (error) => {
            toastMessageHandler(error)
        }
    })

    return {settleUp, isLoadingSettleUp}
}