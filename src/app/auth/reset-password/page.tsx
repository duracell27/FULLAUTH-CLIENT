import { Metadata } from 'next'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = {
	title: 'Reset Password',
	description: 'Reset Password'
}

export default function ResetPasswordPage() {
	return (
		<div className='mt-18'>
			<ResetPasswordForm />
		</div>
	)
}
