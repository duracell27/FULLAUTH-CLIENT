'use client'
import React from 'react'
import { Button } from './ui'
import { FaGoogle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../services'
import { useTranslations } from '../hooks'

type Props = {}

export const AuthSocial = (props: Props) => {
	const router = useRouter()
	const { t } = useTranslations()

	const { mutateAsync } = useMutation({
		mutationKey: ['oauth by provider'],
		mutationFn: async ({ provider }: { provider: 'google' }) =>
			await authService.oauthByProvider(provider)
	})

	const handleClick = async (provider: 'google') => {
		const response = await mutateAsync({ provider })

		if (response) {
			router.push(response.url)
		}
	}

	return (
		<>
			<div className='grid grid-cols-1'>
				<Button onClick={() => handleClick('google')} variant='outline'>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
			</div>
			<div className='my-3 flex items-center justify-center'>
				<div className='border-b border-muted-foreground w-full'></div>
				<div className='uppercase text-xs font-semibold ml-2 mr-2 text-muted-foreground'>
					{t('or')}
				</div>
				<div className='border-b border-muted-foreground w-full'></div>
			</div>
		</>
	)
}
