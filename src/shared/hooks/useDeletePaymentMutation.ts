import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { paymentService } from '../services'

export function useDeletePaymentMutation(groupId: string) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: deletePayment, isPending: isLoadingDeletePayment } =
		useMutation({
			mutationKey: ['delete payment'],
			mutationFn: ({
				groupId,
				creditorId,
				debtorId
			}: {
				groupId: string
				creditorId: string
				debtorId: string
			}) => paymentService.deletePayment(groupId, creditorId, debtorId),
			onSuccess: () => {
				toast.success('Payment deleted successfully')
				queryClient.invalidateQueries({
					queryKey: ['group ' + groupId]
				})
				queryClient.invalidateQueries({ queryKey: ['summary'] })
				// router.push('/groups/' + groupId)
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { deletePayment, isLoadingDeletePayment }
}
