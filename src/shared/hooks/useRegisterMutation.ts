import { useMutation } from '@tanstack/react-query'
import { TypeRegisterSchema } from '../schemas'
import { authService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useTranslations } from './useTranslations'
import { useRouter } from 'next/navigation'

export function useRegisterMutation() {
	const { t } = useTranslations()
	const router = useRouter()
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeRegisterSchema
			recaptcha: string
			onSuccessCallback?: () => void
		}) => authService.register(values, recaptcha),
		onSuccess: (data: any, variables) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('User registered successfully', {
					description: 'Check your email for verification link'
				})
			}
			// Clear form fields
			if (variables.onSuccessCallback) {
				variables.onSuccessCallback()
			}
			// Redirect to login page after successful registration
			setTimeout(() => {
				router.push('/auth/login')
			}, 2000)
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
