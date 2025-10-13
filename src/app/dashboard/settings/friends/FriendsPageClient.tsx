'use client'

import { buttonVariants } from '@/shared/componets/ui'
import React from 'react'
import { Friends } from './Friends'
import { FriendRequest } from './FriendRequest'
import { BackButton } from '@/shared/componets/ui/BackButton'
import Link from 'next/link'
import { useTranslations } from '@/shared/hooks'

type Props = {}

export const FriendsPageClient = (props: Props) => {
	const { t } = useTranslations()
	
	return (
		<div className='flex flex-col gap-3 justify-center items-center w-full max-w-[400px] pt-18'>
			<div className="flex justify-between items-center w-full">
				<BackButton/> 
				<Link href={'/dashboard/settings/friends/add'} className={buttonVariants({variant: 'outline'})}>
					{t('addFriend')}
				</Link>
			</div>
			<FriendRequest />
			<Friends />
		</div>
	)
}
