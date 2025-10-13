import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { toastMessageHandler } from "../utils"
import { toast } from "sonner"
import { TypePasswordResetSchema } from "../schemas"
import { passwordRecoveryService } from "../services"
import { useTranslations } from './useTranslations'

export function useResetPasswordMutation() {
	const { t } = useTranslations()

	const {mutate: reset, isPending: isLoadingReset} = useMutation({
		mutationKey: ['reset password'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypePasswordResetSchema
			recaptcha: string
		}) => passwordRecoveryService.reset(values, recaptcha),
		onSuccess: () => {
            toast.success(t('checkYourEmailForPasswordResetLink'))
        },
		onError: (error) => {
            toastMessageHandler(error)
        }
	})

    return {reset, isLoadingReset}
}
