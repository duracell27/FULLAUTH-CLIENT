import { useQuery } from '@tanstack/react-query'
import { groupsService } from '../services'
import { expenseService } from '../services/expense.service'
import { summaryService } from '../services/summary.service'

export function useSummary() {
	const { data: summaryResponse, isLoading: isLoadingSummary, isError: isErrorSummary, refetch: refetchSummary } = useQuery({
		queryKey: ['summary'],
		queryFn: () => summaryService.getSummary(),
		staleTime: 0,
	})

	return {
		summary: summaryResponse?.userBalances,
		totalBalance: summaryResponse?.totalBalance,
		isLoadingSummary,
		isErrorSummary,
		refetchSummary
	}
}
