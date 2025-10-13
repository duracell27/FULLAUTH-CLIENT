'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'
import { SummaryData } from './SummaryData'
import { useTranslations } from '@/shared/hooks'

type Props = {}

export const SummaryPageClient = (props: Props) => {
	const { t } = useTranslations()
	
	return (
		<div className='flex flex-col gap-3 justify-center items-center mb-18 pt-18 w-full max-w-[400px]'>
			<div className='flex justify-between items-center w-full'>
				<Card className='w-full'>
					<CardHeader>
						<CardTitle>{t('summary')}</CardTitle>
					</CardHeader>
					<CardContent>
						<SummaryData />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
