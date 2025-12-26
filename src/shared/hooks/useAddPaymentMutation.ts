import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddPaymentSchema } from '../schemas/createPayment.schema'
import { paymentService } from '../services'
import { useTranslations } from './useTranslations'

export function useAddPaymentMutation(groupId: string) {
	const { t } = useTranslations()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addPayment, isPending: isLoadingAddPayment } = useMutation({
		mutationKey: ['add payment'],
		mutationFn: (data: TypeAddPaymentSchema) =>
			paymentService.addPayment(data),
		onSuccess: () => {
			toast.success(t('paymentAddedSuccessfully'))
			queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
			queryClient.invalidateQueries({queryKey: ['groups']})
			queryClient.invalidateQueries({queryKey: ['summary']})
			queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
			queryClient.invalidateQueries({queryKey: ['notifications']})
			router.push('/groups/' + groupId)

		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addPayment, isLoadingAddPayment }
}
