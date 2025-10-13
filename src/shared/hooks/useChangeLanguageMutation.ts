import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TypeChangeLanguageSchema } from '../schemas/changeLanguage.schema'
import { useTranslations } from './useTranslations'
import { cookieUtils } from '../utils/cookie'

export function useChangeLanguageMutation() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { t } = useTranslations()
	const { mutate: changeLanguage, isPending: isLoadingChangeLanguage } = useMutation({
		mutationKey: ['change language'],
		mutationFn: ({ values }: { values: TypeChangeLanguageSchema }) =>
			userService.changeLanguage(values),
		onSuccess: (data: any) => {
			if (data.message) {
				toastMessageHandler(data)
			} else {
				// Зберігаємо мову в cookie
				cookieUtils.setLanguage(data.language)
				toast.success(t('languageChanged'))
				 queryClient.invalidateQueries({queryKey: ['profile']})	
				// queryClient.invalidateQueries({queryKey: ['notificationsUnread']})
				
				// Плавне перезавантаження для оновлення всіх текстів
				setTimeout(() => {
					window.location.reload()
				}, 1500)
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { changeLanguage, isLoadingChangeLanguage }
}
