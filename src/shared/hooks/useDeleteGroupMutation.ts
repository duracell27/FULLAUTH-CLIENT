import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { groupsService } from '../services'

export function useDeleteGroupMutation() {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate: deleteGroup, isPending: isLoadingDeleteGroup } =
		useMutation({
			mutationKey: ['delete group'],
			mutationFn: (groupId: string) =>
				groupsService.deleteGroup(groupId),
			onSuccess: (data: any) => {
				if (data.message) {
					toastMessageHandler(data)
				} else {
					toast.success('Group deleted successfully')
					queryClient.invalidateQueries({
						queryKey: ['groups']
					})
					queryClient.invalidateQueries({ queryKey: ['summary'] })
					router.push('/groups')
				}
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { deleteGroup, isLoadingDeleteGroup }
}
