import React from 'react'
import { AddGroupForm } from './AddGroupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Add group'
}

type Props = {}

const AddGroup = (props: Props) => {
	return (
		<div>
			<AddGroupForm />
		</div>
	)
}

export default AddGroup
