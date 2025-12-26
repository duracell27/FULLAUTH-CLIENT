import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { paymentService } from '../services'
import { useTranslations } from './useTranslations'

export function useDeletePaymentMutation(groupId: string) {
	const { t } = useTranslations()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: deletePayment, isPending: isLoadingDeletePayment } =
		useMutation({
			mutationKey: ['delete payment'],
			mutationFn: (paymentId: string) => paymentService.deletePayment(paymentId),
			onSuccess: () => {
				toast.success(t('paymentDeletedSuccessfully'))
				queryClient.invalidateQueries({
					queryKey: ['group ' + groupId]
				})
				queryClient.invalidateQueries({ queryKey: ['summary'] })
				queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				queryClient.invalidateQueries({queryKey: ['notifications']})
				// router.push('/groups/' + groupId)
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { deletePayment, isLoadingDeletePayment }
}
