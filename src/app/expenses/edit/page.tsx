'use client'
import { Card, CardContent } from '@/shared/componets/ui'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from '@/shared/hooks'

type Props = {}

const EditExpense = (props: Props) => {
	const { t } = useTranslations()
	
	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<Card className='w-full max-w-[400px]'>
				<CardContent>
					<h1 className='text-2xl font-bold text-center'>
						{t('incorrectPage')}
					</h1>
					<Link
						href='/groups'
						className='underline text-center text-sm'
					>
						{t('backToGroups')}
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}

export default EditExpense
