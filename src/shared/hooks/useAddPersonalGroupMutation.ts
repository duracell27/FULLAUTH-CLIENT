import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


export function useAddPersonalGroupMutation() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addPersonalGroup, isPending: isLoadingAddPersonalGroup } = useMutation({
		mutationKey: ['add personal group'],
		mutationFn: ({ userId }: { userId: string }) =>
			groupsService.addPersonalGroup(userId),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('Personal group created successfully')
				// Інвалідуємо всі запити, пов'язані з персональними групами
				queryClient.invalidateQueries({queryKey: ['groups']})
				// router.push('/friends')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addPersonalGroup, isLoadingAddPersonalGroup }
}
