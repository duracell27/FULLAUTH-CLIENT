import React from 'react'
import RegisterForm from './RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Register'
}

type Props = {}

const RegisterPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen'>
			<RegisterForm />
		</div>
	)
}

export default RegisterPage
