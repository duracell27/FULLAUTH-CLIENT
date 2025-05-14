import React, { Suspense } from 'react'
import NewPasswordForm from './NewPasswordForm'
import { Metadata } from 'next'
import { Loading } from '@/shared/componets/ui/Loading'

export const metadata: Metadata = {
	title: 'New Password',
	description: 'New Password'
}

export default function NewPasswordPage() {
	return (
		<Suspense fallback={<Loading/>}>
			<NewPasswordForm />
		</Suspense>
	)
}
