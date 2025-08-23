import { buttonVariants, Card, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'
import { Friends } from './Friends'
import { FriendRequest } from './FriendRequest'
import { BackButton } from '@/shared/componets/ui/BackButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Friends'
}


type Props = {}

const FriendsPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center w-full max-w-[400px] pt-18'>
			<div className="flex justify-between items-center w-full">
				<BackButton/> 
				<Link href={'/dashboard/settings/friends/add'} className={buttonVariants({variant: 'outline'})}>Add friend</Link>
			</div>
			<FriendRequest />
			<Friends />
		</div>
	)
}

export default FriendsPage
