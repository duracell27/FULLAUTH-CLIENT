import { useQuery } from '@tanstack/react-query'
import { groupsService } from '../services'
import { expenseService } from '../services/expense.service'
import { summaryService } from '../services/summary.service'

export function useSummary() {
	const { data: summary, isLoading: isLoadingSummary } = useQuery({
		queryKey: ['summary'],
		queryFn: () => summaryService.getSummary()
	})

	return { summary, isLoadingSummary }
}
