import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { expenseService } from '../services/expense.service'
import { useRouter } from 'next/navigation'

export function useDeleteExpenseMutation(groupId: string) {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate: deleteExpense, isPending: isLoadingDeleteExpense } =
		useMutation({
			mutationKey: ['delete expense'],
			mutationFn: (expenseId: string) =>
				expenseService.deleteExpense(expenseId),
			onSuccess: (data: any) => {
				if (data.message) {
					toastMessageHandler(data)
				} else {
					toast.success('Expense deleted successfully')
					queryClient.invalidateQueries({
						queryKey: ['group ' + groupId]
					})
					queryClient.invalidateQueries({ queryKey: ['summary'] })
					router.push('/groups/' + groupId)
				}
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { deleteExpense, isLoadingDeleteExpense }
}
