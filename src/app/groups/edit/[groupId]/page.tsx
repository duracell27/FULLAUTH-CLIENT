import React from 'react'
import { EditGroupForm } from './EditGroupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Edit group'
}

const EditGroupPage = async ({
	params
}: {
	params: Promise<{ groupId: string }>
}) => {
	const { groupId } = await params
	return (
		<div className=''>
			<EditGroupForm groupId={groupId} />
		</div>
	)
}

export default EditGroupPage
