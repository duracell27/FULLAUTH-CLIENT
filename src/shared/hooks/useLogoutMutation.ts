'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services";
import { toastMessageHandler } from "../utils";
import { toast } from "sonner";
import { useTranslations } from "./useTranslations";

export function useLogoutMutation() {
    const router = useRouter()
    const { t } = useTranslations()

    const queryClient = useQueryClient()

    const {mutate: logout, isPending: isLoadingLogout} = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            toast.success(t('youHaveBeenLoggedOutSuccessfully'))
            queryClient.clear()
            router.push('/')
        },
        onError: (error) => {
            toastMessageHandler(error)
        }
    })

    return {logout, isLoadingLogout}
}