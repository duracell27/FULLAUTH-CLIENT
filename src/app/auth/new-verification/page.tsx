import { Metadata } from 'next'
import { NewVerificationForm } from './NewVerificationForm'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'New Verification',
	description: 'New Verification'
}

export default function NewVerificationPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NewVerificationForm />
		</Suspense>
	)
}
