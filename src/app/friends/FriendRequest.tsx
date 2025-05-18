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
	useAcceptFriendRequestMutation,
	useCancelFriendRequestMutation,
	useFriends,
	useProfile,
	useRejectFriendRequestMutation
} from '@/shared/hooks'
import { Check, X } from 'lucide-react'
import React from 'react'

type Props = {}

export const FriendRequest = (props: Props) => {
	const { user, isLoadingProfile } = useProfile()
	const { friendsData, isLoadingFriend } = useFriends()
	const { cancelFriendRequest, isLoadingCancelFriendRequest } =
		useCancelFriendRequestMutation()
	const { acceptFriendRequest, isLoadingAcceptFriendRequest } =
		useAcceptFriendRequestMutation()
	const { rejectFriendRequest, isLoadingRejectFriendRequest } =
		useRejectFriendRequestMutation()

	const cancelFriendRequestHandler = (friendRequestId: string) => {
		cancelFriendRequest(friendRequestId)
	}

	const acceptFriendRequestHandler = (friendRequestId: string) => {
		acceptFriendRequest(friendRequestId)
	}

	const rejectFriendRequestHandler = (friendRequestId: string) => {
		rejectFriendRequest(friendRequestId)
	}

	if (isLoadingFriend || isLoadingProfile) return <Loading />
	if (
		!friendsData?.friendRequests.length &&
		!friendsData?.friendRequestsSended.length
	)
		return null
	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Friend requests</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{friendsData?.friendRequests.map(friend => (
						<li
							key={friend.id}
							className='flex items-center gap-2 py-2 font-medium border-b border-ring/20 py-2 hover:bg-accent block'
						>
							<Avatar>
								<AvatarImage
									src={
										friend.receiverId === user?.id
											? friend?.sender?.picture
											: ''
									}
								/>
								<AvatarFallback>
									{friend.receiverId === user?.id
										? friend?.sender?.displayName
												.slice(0, 2)
												.toUpperCase()
										: ''}
								</AvatarFallback>
							</Avatar>
							<p className='text-base'>
								{friend.receiverId === user?.id
									? friend?.sender?.displayName
									: ''}
							</p>

							<p className='flex-1 text-right'>
								<Button
									className='mr-2'
									onClick={() =>
										acceptFriendRequestHandler(friend.id)
									}
								>
									<Check />
								</Button>
								<Button
									onClick={() =>
										rejectFriendRequestHandler(friend.id)
									}
								>
									<X />
								</Button>
							</p>
						</li>
					))}
				</ul>

				<ul>
					{friendsData?.friendRequestsSended.map(friend => (
						<li
							key={friend.id}
							className='flex items-center gap-2 py-2 font-medium border-b border-ring/20 py-2 hover:bg-accent block'
						>
							<Avatar>
								<AvatarImage
									src={
										friend.senderId === user?.id
											? friend?.receiver?.picture
											: ''
									}
								/>
								<AvatarFallback>
									{friend.senderId === user?.id
										? friend?.receiver?.displayName
												.slice(0, 2)
												.toUpperCase()
										: ''}
								</AvatarFallback>
							</Avatar>
							<p className='text-base'>
								{friend.senderId === user?.id
									? friend?.receiver?.displayName
									: ''}
							</p>

							<p className='flex-1 text-right'>
								<span className='mr-2'>Pending</span>
								<Button
									onClick={() =>
										cancelFriendRequestHandler(friend.id)
									}
								>
									<X />
								</Button>
							</p>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
