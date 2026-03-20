import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { useTranslations } from './useTranslations'
import { toast } from 'sonner'

export function useAcceptJoinRequestMutation(groupId: string) {
	const queryClient = useQueryClient()
	const { t } = useTranslations()

	const { mutate: acceptJoinRequest, isPending: isAcceptingJoinRequest } = useMutation({
		mutationKey: ['accept-join-request', groupId],
		mutationFn: (requesterId: string) => groupsService.acceptJoinRequest(groupId, requesterId),
		onSuccess: () => {
			toast.success(t('memberAcceptedSuccessfully'))
			queryClient.invalidateQueries({ queryKey: ['group ' + groupId] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { acceptJoinRequest, isAcceptingJoinRequest }
}
