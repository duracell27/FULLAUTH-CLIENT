import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TypeEditGroupSchema, TypeLoginSchema } from '../schemas'
import { authService, groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'

export function useEditGroupMutation(groupId: string) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: editGroup, isPending: isLoadingEditGroup } = useMutation({
		mutationKey: ['edit group ' + groupId],
		mutationFn: ({ values }: { values: TypeEditGroupSchema }) =>
			groupsService.editGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('Group edited successfully')
				queryClient.invalidateQueries({ queryKey: ['group ' + groupId] })
				queryClient.invalidateQueries({ queryKey: ['groups'] })
				router.push(`/groups/${groupId}`)
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { editGroup, isLoadingEditGroup }
}
