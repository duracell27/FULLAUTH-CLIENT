import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddExpenseFormNumber } from '../schemas'
import { expenseService } from '../services/expense.service'

export function useEditExpenseMutation(groupId: string, expenseId: string) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: editExpense, isPending: isLoadingEditExpense } =
		useMutation({
			mutationKey: ['edit expense'],
			mutationFn: ({ data, expenseId }: { data: TypeAddExpenseFormNumber; expenseId: string }) =>
				expenseService.editExpense(data, expenseId),
			onSuccess: () => {
				toast.success('Expense edited successfully')
				queryClient.invalidateQueries({
					queryKey: ['group ' + groupId]
				})
				queryClient.invalidateQueries({ queryKey: ['expense ' + expenseId] })
				queryClient.invalidateQueries({ queryKey: ['summary'] })
				queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				queryClient.invalidateQueries({queryKey: ['notifications']})
				router.push('/groups/' + groupId)
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { editExpense, isLoadingEditExpense }
}
