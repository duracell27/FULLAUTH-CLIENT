import { useQuery } from '@tanstack/react-query'
import { expenseService } from '../services/expense.service'

export function useExpenseFormData(expenseId: string) {
	const { data: expenseFormData, isLoading: isLoadingExpenseFormData } = useQuery({
		queryKey: ['expenseFormData ' + expenseId],
		queryFn: () => expenseService.getExpenseFormData(expenseId),
		enabled: !!expenseId // Запит виконується тільки якщо expenseId не порожній
	})

	return { expenseFormData, isLoadingExpenseFormData }
}
