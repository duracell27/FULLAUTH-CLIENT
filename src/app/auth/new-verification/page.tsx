import { Metadata } from 'next'
import { NewVerificationForm } from './NewVerificationForm'
import { Suspense } from 'react'
import { Loading } from '@/shared/componets/ui/Loading'

export const metadata: Metadata = {
	title: 'New Verification',
	description: 'New Verification'
}

export default function NewVerificationPage() {
	return (
		<Suspense fallback={<Loading />}>
			<NewVerificationForm />
		</Suspense>
	)
}
