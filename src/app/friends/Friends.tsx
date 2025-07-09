'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import {
	useCancelFriendRequestMutation,
	useFriends,
	useProfile
} from '@/shared/hooks'
import { X } from 'lucide-react'
import React from 'react'

type Props = {}

export const Friends = (props: Props) => {
	const { user } = useProfile()
	const { friendsData, isLoadingFriend } = useFriends()
	const { cancelFriendRequest, isLoadingCancelFriendRequest } =
		useCancelFriendRequestMutation()

		

	if (!user || !friendsData) return null

	const cancelFriendRequestHandler = (friendRequestId: string) => {
		
		cancelFriendRequest(friendRequestId)
	}
	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<CardTitle>Friends</CardTitle>
			</CardHeader>
			<CardContent>
				{friendsData?.friends.length > 0 ? (
					<ul>
						{friendsData?.friends.map(friend => (
							<li
								key={friend.id}
								className='flex items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent block'
							>
								<Avatar>
									<AvatarImage
										src={
											friend.senderId === user?.id
												? friend?.receiver?.picture
												: friend?.sender?.picture
										}
									/>
									<AvatarFallback>
										{friend.senderId === user?.id
											? friend?.receiver?.displayName
													.slice(0, 2)
													.toUpperCase()
											: friend?.sender?.displayName
													.slice(0, 2)
													.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<p className='text-base'>
									{friend.senderId === user?.id
										? friend?.receiver?.displayName
										: friend?.sender?.displayName}
								</p>
								<p className='flex-1 text-right'>
									<Button
										onClick={() =>
											cancelFriendRequestHandler(
												friend.id
											)
										}
									>
										<X />
									</Button>
								</p>
							</li>
						))}
					</ul>
				) : (
					<p>You have no friends yet</p>
				)}
			</CardContent>
		</Card>
	)
}
