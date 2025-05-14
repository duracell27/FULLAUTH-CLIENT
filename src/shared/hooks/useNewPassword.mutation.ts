import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { TypeNewPasswordSchema } from '../schemas'
import { passwordRecoveryService } from '../services'

export function useNewPasswordMutation() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const { mutate: newPassword, isPending: isLoadingNewPassword } =
		useMutation({
			mutationKey: ['new password'],
			mutationFn: ({
				values,
				recaptcha
			}: {
				values: TypeNewPasswordSchema
				recaptcha: string
			}) => passwordRecoveryService.new(values, token, recaptcha),
			onSuccess: () => {
				toast.success('Password changed successfully')
                router.push('/dashboard/settings')
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { newPassword, isLoadingNewPassword }
}
