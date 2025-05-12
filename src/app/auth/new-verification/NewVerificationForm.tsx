'use client'
import { AuthWrapper } from '@/shared/componets/AuthWrapper'
import { Loading } from '@/shared/componets/ui/Loading'
import { useVerificationMutation } from '@/shared/hooks/useVerificationMutation'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function NewVerificationForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { verification } = useVerificationMutation()

	useEffect(() => {
		verification({ token })
	}, [token])

	return (
		<AuthWrapper heading='New verification'>
			<div className=''>
				<Loading />
			</div>
		</AuthWrapper>
	)
}
