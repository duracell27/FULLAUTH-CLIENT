'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	buttonVariants,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui'
import {
	useFriends,
	useTranslations
} from '@/shared/hooks'
import { useDeleteMemberFromGroupMutation } from '@/shared/hooks/useDeleteMemberFromGroupMutation'
import { useAddFriendMutation } from '@/shared/hooks/useAddFriendMutation'
import { GroupMemberStatus, GroupRole } from '@/shared/types'
import { FriendStatus, IUser } from '@/shared/types/user.types'
import { IGroup } from '@/shared/types/groupe.types'
import { Lock, UserPlus, X } from 'lucide-react'
import Link from 'next/link'

type Props = {
	group: IGroup
	user: IUser
}

export const MembersCard = ({ group, user }: Props) => {
	const { t } = useTranslations()
	const { deleteMember } = useDeleteMemberFromGroupMutation(group.id)
	const { addFriend, isLoadingAddFriend } = useAddFriendMutation()
	const { friendsData } = useFriends()

	const isCurrentUserAdmin =
		group.members.find(member => member.userId === user.id)?.role === GroupRole.ADMIN

	const isUserInFriends = (userId: string) => {
		if (!friendsData?.friends) return false
		return friendsData.friends.some(
			friend =>
				(friend.senderId === userId || friend.receiverId === userId) &&
				friend.status === FriendStatus.Accepted
		)
	}

	const getFriendRequestStatus = (userId: string) => {
		if (!friendsData?.friendRequests && !friendsData?.friendRequestsSended)
			return null

		const incomingRequest = friendsData.friendRequests?.find(
			friend => friend.senderId === userId
		)
		if (incomingRequest) return incomingRequest.status

		const outgoingRequest = friendsData.friendRequestsSended?.find(
			friend => friend.receiverId === userId
		)
		if (outgoingRequest) return outgoingRequest.status

		return null
	}

	const handleDeleteMember = (recieverId: string) => {
		deleteMember({ values: { groupId: group.id, userId: recieverId } })
	}

	const handleAddFriend = (userId: string) => {
		addFriend(userId)
	}

	return (
		<Card className=''>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					<span>{t('members')}</span>
					{isCurrentUserAdmin && !group.isPersonal && (
						<Link
							href={`/groups/members/${group.id}`}
							className={buttonVariants()}
							aria-disabled={group.isLocked || group.isFinished}
							tabIndex={group.isLocked || group.isFinished ? -1 : 0}
							style={
								group.isLocked || group.isFinished
									? { pointerEvents: 'none', opacity: 0.6 }
									: {}
							}
						>
							{(group.isLocked || group.isFinished) && (
								<Lock className='mr inline-block' />
							)}
							{t('addMember')}
						</Link>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{group.members.map(member => (
						<li
							className='flex w-full items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
							key={member.userId}
						>
							<div className='flex w-full gap-2 items-center'>
								<Avatar>
									<AvatarImage src={member.user.picture} />
									<AvatarFallback>
										{member.user.displayName
											.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='flex gap-2 items-center flex-1'>
									{member.status === GroupMemberStatus.PENDING ? (
										<>
											<span className='font-bold text-muted-foreground'>
												{member.user.displayName}
											</span>
											<Badge className='text-xs bg-muted-foreground'>
												{t('invited')}
											</Badge>
										</>
									) : (
										<span className='font-bold'>
											{member.user.displayName}
										</span>
									)}

									{member.role === GroupRole.ADMIN && (
										<Badge className='text-xs'>{t('admin')}</Badge>
									)}
								</div>

								<div className='flex gap-2'>
									{/* Add Friend Button */}
									{member.userId !== user.id &&
										member.status !== GroupMemberStatus.PENDING &&
										!isUserInFriends(member.userId) && (
											<Button
												type='button'
												variant={'outline'}
												size={'xs'}
												onClick={() => {
													if (
														getFriendRequestStatus(member.userId) !==
														FriendStatus.Pending
													) {
														handleAddFriend(member.userId)
													}
												}}
												disabled={isLoadingAddFriend}
												className={`${
													getFriendRequestStatus(member.userId) ===
													FriendStatus.Pending
														? 'text-orange-500 border-orange-500 cursor-not-allowed'
														: 'text-good-green border-good-green hover:bg-good-green hover:text-white'
												}`}
											>
												{getFriendRequestStatus(member.userId) ===
												FriendStatus.Pending ? (
													<span className='flex items-center gap-1 text-xs'>
														Pending{' '}
														<UserPlus className='size-4' />
													</span>
												) : isLoadingAddFriend ? (
													<span className='text-xs'>...</span>
												) : (
													<UserPlus className='size-4' />
												)}
											</Button>
										)}

									{/* Remove Member Button */}
									{isCurrentUserAdmin && member.userId !== user.id && (
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													type='button'
													variant={'default'}
													size={'xs'}
												>
													<X />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														{t('areYouAbsolutelySure')}
													</AlertDialogTitle>
													<AlertDialogDescription>
														{t('areYouSureYouWantToRemoveThisMember')}
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														{t('cancel')}
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteMember(member.userId)}
														className='bg-bad-red hover:bg-bad-red/80'
													>
														{t('continue')}
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
