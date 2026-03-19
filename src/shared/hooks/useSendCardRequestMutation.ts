import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardRequestService } from '../services/cardRequest.service'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useTranslations } from './useTranslations'

export const useSendCardRequestMutation = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslations()

	const { mutate: sendCardRequest, isPending: isSendingCardRequest } = useMutation({
		mutationFn: (targetId: string) => cardRequestService.sendRequest(targetId),
		onSuccess: () => {
			toast.success(t('cardRequestSent'))
			queryClient.invalidateQueries({ queryKey: ['card-requests-sent'] })
		},
		onError: (error: any) => {
			const message = error?.message
			if (message === 'Request is already pending') {
				toast.info(t('cardRequestAlreadyPending'))
			} else {
				toastMessageHandler(error)
			}
		}
	})

	return { sendCardRequest, isSendingCardRequest }
}
