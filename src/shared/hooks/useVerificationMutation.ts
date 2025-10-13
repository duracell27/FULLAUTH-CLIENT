'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { verificationService } from '../services'
import { toast } from 'sonner'
import { useTranslations } from './useTranslations'

export function useVerificationMutation() {
	const router = useRouter()
	const { t } = useTranslations()

	const {mutate: verification} = useMutation({
		mutationKey: ['new verification'],
		mutationFn: ({ token }: { token: string | null }) =>
			verificationService.newVerification(token),
		onSuccess: () => {
			toast.success(t('emailVerificationIsSuccessful'))
			router.push('/dashboard/settings')
		},
		onError: () => {
			router
		}
	})

    return {verification}
}
