import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddExpenseForm, TypeAddExpenseFormNumber } from '../schemas'
import { expenseService } from '../services/expense.service'
import { TypeAddPaymentSchema } from '../schemas/createPayment.schema'
import { paymentService } from '../services'

export function useAddPaymentMutation(groupId: string) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addPayment, isPending: isLoadingAddPayment } = useMutation({
		mutationKey: ['add payment'],
		mutationFn: (data: TypeAddPaymentSchema) =>
			paymentService.addPayment(data),
		onSuccess: () => {
			toast.success('Payment added successfully')
			queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
			queryClient.invalidateQueries({queryKey: ['summary']})
			router.push('/groups/' + groupId)
			
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addPayment, isLoadingAddPayment }
}
