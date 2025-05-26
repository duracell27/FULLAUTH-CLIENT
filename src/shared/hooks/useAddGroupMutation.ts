import { useMutation } from '@tanstack/react-query'
import { TypeLoginSchema } from '../schemas'
import { authService, groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'

export function useAddGroupMutation() {
	const router = useRouter()
	const { mutate: addGroup, isPending: isLoadingAddGroup } = useMutation({
		mutationKey: ['add group'],
		mutationFn: ({ values }: { values: TypeAddGroupSchema }) =>
			groupsService.addGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success('Group created successfully')
				router.push('/groups')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addGroup, isLoadingAddGroup }
}
