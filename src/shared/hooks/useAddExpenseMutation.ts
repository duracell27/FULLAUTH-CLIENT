import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddExpenseForm, TypeAddExpenseFormNumber } from '../schemas'
import { expenseService } from '../services/expense.service'

export function useAddExpenseMutation() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addExpense, isPending: isLoadingAddExpense } = useMutation({
		mutationKey: ['add expense'],
		mutationFn: (data: TypeAddExpenseFormNumber) =>
			expenseService.addExpense(data),
		onSuccess: () => {
			toast.success('Expense added successfully')
			//queryClient.invalidateQueries({queryKey: ['friends']})
			//router.push('/friends')
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addExpense, isLoadingAddExpense }
}
