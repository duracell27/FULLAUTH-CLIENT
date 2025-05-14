import React from 'react'
import NewPasswordForm from './NewPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'New Password',
	description: 'New Password'
}

export default function NewPasswordPage() {
	return <NewPasswordForm />
}
