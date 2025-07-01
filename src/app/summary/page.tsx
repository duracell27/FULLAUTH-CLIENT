import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'

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
            <p>Summary will be here</p>
          </CardContent>
				</Card>
			</div>
		</div>
	)
}

export default SummaryPage
