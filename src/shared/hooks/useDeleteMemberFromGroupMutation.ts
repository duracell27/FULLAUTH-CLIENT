import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'

import { TypeAddMemberToGroupSchema } from '../schemas/addMemberToGroup.schema'
import { memberService } from '../services/members.service'


export function useDeleteMemberFromGroupMutation(groupId: string) {
	const queryClient = useQueryClient()

	const { mutate: deleteMember, isPending: isLoadingDeleteMember } = useMutation({
		mutationKey: ['delete member'],
		mutationFn: ({ values }: { values: TypeAddMemberToGroupSchema }) =>
			memberService.deleteMemberFromGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('Member deleted successfully')
				 queryClient.invalidateQueries({queryKey: ['group ' + groupId]})
				// router.push('/groups')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { deleteMember, isLoadingDeleteMember }
}
