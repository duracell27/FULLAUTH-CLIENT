import React from 'react'
import { AddFriendPageClient } from './AddFriendPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Add friend'
}

type Props = {}

const AddFriendPage = (props: Props) => {
	return <AddFriendPageClient />
}

export default AddFriendPage
