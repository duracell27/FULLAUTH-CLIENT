import React from 'react'
import { GroupData } from './GroupData'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Group details'
}


const GroupPage = async ({
	params
}: {
	params: Promise<{ groupId: string }>
}) => {
	const { groupId } = await params
	return (
		
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<GroupData groupId={groupId} />
		</div>
		
		
	)
}

export default GroupPage
