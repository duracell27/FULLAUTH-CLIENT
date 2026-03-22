import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberService } from '../services/members.service'
import { toastMessageHandler } from '../utils'
import { useTranslations } from './useTranslations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useLeaveGroupMutation(groupId: string) {
	const queryClient = useQueryClient()
	const { t } = useTranslations()
	const router = useRouter()

	const { mutate: leaveGroup, isPending: isLeavingGroup } = useMutation({
		mutationKey: ['leave-group', groupId],
		mutationFn: () => memberService.leaveGroup(groupId),
		onSuccess: () => {
			toast.success(t('groupLeftSuccessfully'))
			queryClient.invalidateQueries({ queryKey: ['groups'] })
			router.replace('/groups')
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { leaveGroup, isLeavingGroup }
}
