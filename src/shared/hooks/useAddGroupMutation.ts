'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TypeLoginSchema } from '../schemas'
import { authService, groupsService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TypeAddGroupSchema } from '../schemas/createGroup.schema'
import { useTranslations } from './useTranslations'

export function useAddGroupMutation() {
	const { t } = useTranslations()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { mutate: addGroup, isPending: isLoadingAddGroup } = useMutation({
		mutationKey: ['add group'],
		mutationFn: ({ values }: { values: TypeAddGroupSchema }) =>
			groupsService.addGroup(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				toast.success(t('groupCreatedSuccessfully'))
				queryClient.invalidateQueries({queryKey: ['groups']})
				// queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				router.push('/groups')
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { addGroup, isLoadingAddGroup }
}
