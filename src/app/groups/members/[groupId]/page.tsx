import React from 'react'
import { MemberData } from './MemberData'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Group members'
}

const AddMemberPage = async ({
	params
}: {
	params: Promise<{ groupId: string }>
}) => {
	const { groupId } = await params
	return (
		<div className='flex flex-col gap-3 justify-start items-center pt-18'>
			<MemberData groupId={groupId} />
		</div>
	)
}

export default AddMemberPage
