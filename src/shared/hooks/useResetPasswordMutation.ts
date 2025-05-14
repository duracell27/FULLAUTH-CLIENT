import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { toastMessageHandler } from "../utils"
import { toast } from "sonner"
import { TypePasswordResetSchema } from "../schemas"
import { passwordRecoveryService } from "../services"

export function useResetPasswordMutation() {

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
            toast.success('Check your email for password reset link')
        },
		onError: (error) => {
            toastMessageHandler(error)
        }
	})

    return {reset, isLoadingReset}
}
