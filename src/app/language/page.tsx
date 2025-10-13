import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ToggleTheme
} from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { Metadata } from 'next'
import { ChangeLanguageForm } from './LanguageForm'

export const metadata: Metadata = {
	title: 'Site language'
}

type Props = {}

const LanguagePage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center max-w-[400px] pt-18'>
			<ChangeLanguageForm />
		</div>
	)
}

export default LanguagePage
