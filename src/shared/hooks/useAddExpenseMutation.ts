import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useRouter } from 'next/navigation'
import { TypeAddExpenseForm, TypeAddExpenseFormNumber } from '../schemas'
import { expenseService } from '../services/expense.service'
import { useTranslations } from './useTranslations'

export function useAddExpenseMutation(groupId: string) {
	const { t } = useTranslations()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addExpense, isPending: isLoadingAddExpense } = useMutation({
		mutationKey: ['add expense'],
		mutationFn: (data: TypeAddExpenseFormNumber) =>
			expenseService.addExpense(data),
		onSuccess: () => {
			toast.success(t('expenseAddedSuccessfully'))
			queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
			queryClient.invalidateQueries({queryKey: ['summary']})
			queryClient.invalidateQueries({queryKey: ['groups']})
			queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
			queryClient.invalidateQueries({queryKey: ['notifications']})
			router.push('/groups/' + groupId)
			
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addExpense, isLoadingAddExpense }
}
