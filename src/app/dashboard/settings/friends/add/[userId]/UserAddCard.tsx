'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import { useAddFriendMutation } from '@/shared/hooks/useAddFriendMutation'
import { useProfileSafe } from '@/shared/hooks/useProfileSafe'
import { useTranslations } from '@/shared/hooks'
import React from 'react'

type Props = {
	userId: string
}

export const UserAddCard = ({ userId }: Props) => {
	const { user, isLoadingProfile } = useProfileSafe(userId)
    const {addFriend, isLoadingAddFriend} = useAddFriendMutation()
	const { t } = useTranslations()

	if (isLoadingProfile) {
		return <Loading />
	}

    const handleAddFriend = () => {
        addFriend(userId)
    }

	return (
		<div className=''>
			<ul>
				<li className='flex items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'>
					<Avatar>
						<AvatarImage src={user?.picture} />
						<AvatarFallback>
							{user?.displayName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<p className='text-base'>{user?.displayName}</p>
					<p className='flex-1 text-right'>
						<Button onClick={() => handleAddFriend()}>{t('send')}</Button>
					</p>
				</li>
			</ul>
		</div>
	)
}
