import React from 'react'
import RegisterForm from './RegisterForm'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { cookieUtils } from '@/shared/utils/cookie'
import { siteMetadata } from '@/shared/constants/metadata'
import { Language } from '@/shared/types'

export async function generateMetadata(): Promise<Metadata> {
	const headersList = await headers()
	const cookieHeader = headersList.get('cookie')
	const language = cookieUtils.getLanguageFromCookie(cookieHeader || undefined)

	const metadata = siteMetadata[language] || siteMetadata[Language.EN]

	return {
		title: metadata.registerTitle
	}
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
