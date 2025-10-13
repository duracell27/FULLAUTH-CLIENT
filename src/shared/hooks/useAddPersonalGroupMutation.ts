import { useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from './useTranslations'


export function useAddPersonalGroupMutation() {
	const { t } = useTranslations()
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
				toast.success(t('personalGroupCreatedSuccessfully'))
				// Інвалідуємо всі запити, пов'язані з персональними групами
				queryClient.invalidateQueries({queryKey: ['groups']})
				queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				queryClient.invalidateQueries({queryKey: ['notifications']})
				// router.push('/friends')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addPersonalGroup, isLoadingAddPersonalGroup }
}
