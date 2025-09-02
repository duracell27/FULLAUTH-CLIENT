import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'

import { TypeAddMemberToGroupSchema } from '../schemas/addMemberToGroup.schema'
import { memberService } from '../services/members.service'

export function useAddMemberToGroupMutation(groupId: string) {

	const queryClient = useQueryClient()

	const { mutate: addMember, isPending: isLoadingAddMember } = useMutation({
		mutationKey: ['add member'],
		mutationFn: ({ values }: { values: TypeAddMemberToGroupSchema }) =>
			memberService.addMemberToGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('Member request sent')
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

	return { addMember, isLoadingAddMember }
}
