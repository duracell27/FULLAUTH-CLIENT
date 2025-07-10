import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'
import { SummaryData } from './SummaryData'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Summary'
}

type Props = {}

const SummaryPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full max-w-[400px]'>
			<div className='flex justify-between items-center w-full'>
				<Card className='w-full'>
					<CardHeader>
						<CardTitle>Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<SummaryData />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default SummaryPage
