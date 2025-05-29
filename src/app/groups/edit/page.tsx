import { Card, CardContent } from '@/shared/componets/ui'
import Link from 'next/link'
import React from 'react'

type Props = {}

const EditGroup = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<Card className='w-full max-w-[400px]'>
				<CardContent>
					<h1 className='text-2xl font-bold text-center'>
						Incorect page
					</h1>
					<Link
						href='/groups'
						className='underline text-center text-sm'
					>
						Back to groups
					</Link>
				</CardContent>
			</Card>
		</div>
	)
}

export default EditGroup
