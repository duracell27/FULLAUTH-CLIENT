import { useMutation } from '@tanstack/react-query'
import { TypeRegisterSchema } from '../schemas'
import { authService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'

export function useRegisterMutation() {
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeRegisterSchema
			recaptcha: string
		}) => authService.register(values, recaptcha),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('User registered successfully', {
					description: 'Check your email for verification link'
				})
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
