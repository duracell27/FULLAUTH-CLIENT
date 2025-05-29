import React from 'react'
import { EditGroupForm } from './EditGroupForm'

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
