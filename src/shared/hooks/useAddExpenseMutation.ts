import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddExpenseForm, TypeAddExpenseFormNumber } from '../schemas'
import { expenseService } from '../services/expense.service'

export function useAddExpenseMutation(groupId: string) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addExpense, isPending: isLoadingAddExpense } = useMutation({
		mutationKey: ['add expense'],
		mutationFn: (data: TypeAddExpenseFormNumber) =>
			expenseService.addExpense(data),
		onSuccess: () => {
			toast.success('Expense added successfully')
			queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
			router.push('/groups/' + groupId)
			
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addExpense, isLoadingAddExpense }
}
