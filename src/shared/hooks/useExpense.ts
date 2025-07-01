import { useQuery } from '@tanstack/react-query'
import { groupsService } from '../services'
import { expenseService } from '../services/expense.service'

export function useExpense(expenseId: string) {
	const { data: expense, isLoading: isLoadingExpense } = useQuery({
		queryKey: ['expense ' + expenseId],
		queryFn: () => expenseService.getExpense(expenseId)
	})

	return { expense, isLoadingExpense }
}
