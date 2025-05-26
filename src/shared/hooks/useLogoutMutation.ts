import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services";
import { toastMessageHandler } from "../utils";
import { toast } from "sonner";

export function useLogoutMutation() {
    const router = useRouter()

    const queryClient = useQueryClient()

    const {mutate: logout, isPending: isLoadingLogout} = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            toast.success('You have been logged out successfully')
            queryClient.clear()
            router.push('/')
        },
        onError: (error) => {
            toastMessageHandler(error)
        }
    })

    return {logout, isLoadingLogout}
}