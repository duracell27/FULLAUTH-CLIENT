import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TypeSettingsSchema } from '../schemas'
import { userService } from '../services'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'
import { useTranslations } from './useTranslations'

export function useUpdateProfileMutation() {
	const { t } = useTranslations()
	const queryClient = useQueryClient()

	const {mutate: updateProfile, isPending: isLoadingUpdateProfile} = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeSettingsSchema) =>
			userService.updateProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			toast.success(t('profileUpdatedSuccessfully'))
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

    return {updateProfile, isLoadingUpdateProfile}
}
