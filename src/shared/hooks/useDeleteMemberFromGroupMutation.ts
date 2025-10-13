import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'

import { TypeAddMemberToGroupSchema } from '../schemas/addMemberToGroup.schema'
import { memberService } from '../services/members.service'
import { useTranslations } from './useTranslations'


export function useDeleteMemberFromGroupMutation(groupId: string) {
	const { t } = useTranslations()
	const queryClient = useQueryClient()

	const { mutate: deleteMember, isPending: isLoadingDeleteMember } = useMutation({
		mutationKey: ['delete member'],
		mutationFn: ({ values }: { values: TypeAddMemberToGroupSchema }) =>
			memberService.deleteMemberFromGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success(t('memberDeletedSuccessfully'))
				 queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
				 queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				 queryClient.invalidateQueries({queryKey: ['notifications']})
				// router.push('/groups')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { deleteMember, isLoadingDeleteMember }
}
