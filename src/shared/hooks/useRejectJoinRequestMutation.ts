import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { useTranslations } from './useTranslations'
import { toast } from 'sonner'

export function useRejectJoinRequestMutation(groupId: string) {
	const queryClient = useQueryClient()
	const { t } = useTranslations()

	const { mutate: rejectJoinRequest, isPending: isRejectingJoinRequest } = useMutation({
		mutationKey: ['reject-join-request', groupId],
		mutationFn: (requesterId: string) => groupsService.rejectJoinRequest(groupId, requesterId),
		onSuccess: () => {
			toast.success(t('groupRequestRejected'))
			queryClient.invalidateQueries({ queryKey: ['group ' + groupId] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { rejectJoinRequest, isRejectingJoinRequest }
}
