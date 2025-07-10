import React from 'react'
import { LoginForm } from './LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Login'
}

type Props = {}

const LoginPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen'>
			<LoginForm />
		</div>
	)
}

export default LoginPage
