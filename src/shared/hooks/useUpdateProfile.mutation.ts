import { useMutation } from '@tanstack/react-query'
import { TypeSettingsSchema } from '../schemas'
import { userService } from '../services'
import { toast } from 'sonner'
import { toastMessageHandler } from '../utils'

export function useUpdateProfileMutation() {
	const {mutate: updateProfile, isPending: isLoadingUpdateProfile} = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeSettingsSchema) =>
			userService.updateProfile(data),
		onSuccess: () => {
			toast.success('Profile updated successfully')
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

    return {updateProfile, isLoadingUpdateProfile}
}
