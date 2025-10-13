import React from 'react'
import { FriendsPageClient } from './FriendsPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Friends'
}

type Props = {}

const FriendsPage = (props: Props) => {
	return <FriendsPageClient />
}

export default FriendsPage
