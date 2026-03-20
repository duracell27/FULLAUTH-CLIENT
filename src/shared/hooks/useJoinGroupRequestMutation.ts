import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { useTranslations } from './useTranslations'
import { toast } from 'sonner'

export function useJoinGroupRequestMutation(groupId: string) {
	const queryClient = useQueryClient()
	const { t } = useTranslations()

	const { mutate: sendJoinRequest, isPending: isSendingJoinRequest } = useMutation({
		mutationKey: ['join-group-request', groupId],
		mutationFn: () => groupsService.sendJoinRequest(groupId),
		onSuccess: () => {
			toast.success(t('groupJoinRequestSent'))
			queryClient.invalidateQueries({ queryKey: ['public-group', groupId] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { sendJoinRequest, isSendingJoinRequest }
}
