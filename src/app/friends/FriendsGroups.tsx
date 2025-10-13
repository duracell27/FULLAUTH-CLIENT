'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	buttonVariants,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import { useFriends, useProfile, useTranslations } from '@/shared/hooks'
import { useAddPersonalGroupMutation } from '@/shared/hooks/useAddPersonalGroupMutation'
import { usePersonalGroups } from '@/shared/hooks/usePersonalGroups'
import { IUserGroup, IUserSafe } from '@/shared/types'
import { Language } from '@/shared/types/user.types'
import colorBalance from '@/shared/utils/colorBalance'
import { formatDate } from '@/shared/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export const FriendsGroups = (props: Props) => {
	const { user } = useProfile()
	const { friendsData, isLoadingFriend } = useFriends()
	const { addPersonalGroup, isLoadingAddPersonalGroup } =
		useAddPersonalGroupMutation()
	const { t } = useTranslations()

	const {
		activeGroups,
		finishedGroups,
		loadMoreActive,
		loadMoreFinished,
		hasNextActive,
		hasNextFinished,
		isLoadingActive,
		isLoadingFinished,
		isFetchingNextActive,
		isFetchingNextFinished
	} = usePersonalGroups()

	if (!user || !friendsData) return null
	if (isLoadingActive || isLoadingFinished ) {
		return <Loading />
	}

	return (
		<div className='w-full max-w-[400px]'>
			{/* ACTIVE GROUPS LIST */}
			<Card className='w-full max-w-[400px] mb-18'>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span>{t('personalGroups')}</span>
						{/* <Link href='/groups/add' className={buttonVariants()}>
							Add
						</Link> */}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{activeGroups && activeGroups.length === 0 && <div>{t('youHaveNoGroups')}</div>}
					<ul>
						{activeGroups.map((group: IUserGroup) => (
							<li className='' key={group.id}>
								<Link
									className='border px-1 border-ring/20 py-2 bg-primary/10 my-1 hover:bg-accent flex justify-between rounded-xl items-center gap-2'
									href={`/groups/${group.id}`}
								>
									<div className='flex gap-2 items-center'>
										<div className=''>
											<Avatar>
												<AvatarImage
													src={
														group.members.find(member => member.id !== user?.id)?.picture?.length
															? group.members.find(member => member.id !== user?.id)?.picture?.replace(
																	'/upload/',
																	'/upload/w_100,h_100,c_fill,f_webp,q_80/'
															  )
															: ''
													}
												/>
												<AvatarFallback>
													{group.members.find(member => member.id !== user?.id)?.displayName
														?.slice(0, 2)
														.toUpperCase() || 'UN'}
												</AvatarFallback>
											</Avatar>
										</div>
										<div className=''>
											<h2 className='font-bold'>
												{' '}
												{group.members.find(member => member.id !== user?.id)?.displayName || t('unknown')}
											</h2>
											<span className='text-xs'>
												{formatDate(group.eventDate, 'PP', user?.language || Language.EN)}
											</span>
										</div>
									</div>
									<div className='flex flex-col gap-1 items-end'>
										<h2>
											{colorBalance({
												balance: group.userBalance,
												fontSize: 'text-md'
											})}
										</h2>
										<div className=''>
											<ul className='flex gap-1 items-center justify-end bg-primary/40 p-1 rounded-full'>
												{group.members.map(
													(member: IUserSafe) => (
														<li key={member.id}>
															<Avatar className='size-4'>
																<AvatarImage
																	src={
																		member
																			.picture
																			.length
																			? member.picture.replace(
																					'/upload/',
																					'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																			  )
																			: ''
																	}
																/>
																<AvatarFallback className='text-[9px]'>
																	{member.displayName
																		.slice(
																			0,
																			2
																		)
																		.toUpperCase()}
																</AvatarFallback>
															</Avatar>
														</li>
													)
												)}
												<li key={'memberCount'}>
													<div className='size-4 bg-primary text-center rounded-full text-background text-xs'>
														{group.membersCount}
													</div>
												</li>
											</ul>
										</div>
									</div>
								</Link>
							</li>
						))}
					</ul>
					{hasNextActive && (
						<Button
							className='w-full mt-2'
							onClick={() => loadMoreActive()}
							disabled={isFetchingNextActive}
						>
							{isFetchingNextActive ? t('loading') : t('loadMore')}
						</Button>
					)}
				</CardContent>
			</Card>

			{/* FINISHED GROUPS LIST */}
			{finishedGroups.length > 0 && (
				<Card className='w-full max-w-[400px] mb-18'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>{t('finishedGroups')}</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{finishedGroups.map((group: IUserGroup) => (
								<li className='' key={group.id}>
									<Link
										className='border px-1 border-ring/20 py-2 bg-primary/10 my-1 hover:bg-accent flex justify-between rounded-xl items-center gap-2'
										href={`/groups/${group.id}`}
									>
										<div className='flex gap-2 items-center'>
											<div className=''>
												<Avatar>
													<AvatarImage
														src={
															group.members.find(member => member.id !== user?.id)?.picture?.length
																? group.members.find(member => member.id !== user?.id)?.picture?.replace(
																		'/upload/',
																		'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																  )
																: ''
														}
													/>
													<AvatarFallback>
														{group.members.find(member => member.id !== user?.id)?.displayName
															?.slice(0, 2)
															.toUpperCase() || 'UN'}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className=''>
												<h2 className='font-bold'>
													{' '}
													{group.members.find(member => member.id !== user?.id)?.displayName || t('unknown')}
												</h2>
												<span className='text-xs'>
													{formatDate(group.eventDate, 'PP', user?.language || Language.EN)}
												</span>
											</div>
										</div>
										<div className='flex flex-col gap-1 items-end'>
											<h2>
												{colorBalance({
													balance: group.userBalance,
													fontSize: 'text-md'
												})}
											</h2>
											<div className=''>
												<ul className='flex gap-1 items-center justify-end bg-primary/40 p-1 rounded-full'>
													{group.members.map(
														(member: IUserSafe) => (
															<li key={member.id}>
																<Avatar className='size-4'>
																	<AvatarImage
																		src={
																			member
																				.picture
																				.length
																				? member.picture.replace(
																						'/upload/',
																						'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																				  )
																				: ''
																		}
																	/>
																	<AvatarFallback className='text-[9px]'>
																		{member.displayName
																			.slice(
																				0,
																				2
																			)
																			.toUpperCase()}
																	</AvatarFallback>
																</Avatar>
															</li>
														)
													)}
													<li key={'memberCount'}>
														<div className='size-4 bg-primary text-center rounded-full text-background text-xs'>
															{group.membersCount}
														</div>
													</li>
												</ul>
											</div>
										</div>
									</Link>
								</li>
							))}
						</ul>
						{hasNextFinished && (
							<Button
								className='w-full mt-2'
								onClick={() => loadMoreFinished()}
								disabled={isFetchingNextFinished}
							>
								{isFetchingNextFinished
									? t('loading')
									: t('loadMore')}
							</Button>
						)}
					</CardContent>
				</Card>
			)}

			{/* Friends to invite LIST */}
			{friendsData?.friends.filter(friend => {
				// Отримуємо ID друга (не поточного користувача)
				const friendId = friend.senderId === user?.id 
					? friend?.receiverId 
					: friend?.senderId
				
				// Перевіряємо чи вже є персональна група з цим другом
				const hasPersonalGroup = activeGroups.some(group => 
					group.members.some(member => member.id === friendId)
				)
				
				// Показуємо тільки якщо персональної групи ще немає
				return !hasPersonalGroup
			}).length > 0 && (
				<Card className=''>
					<CardHeader>
						<CardTitle>{t('friendsToInvite')}</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{friendsData?.friends.filter(friend => {
								// Отримуємо ID друга (не поточного користувача)
								const friendId = friend.senderId === user?.id 
									? friend?.receiverId 
									: friend?.senderId
								
								// Перевіряємо чи вже є персональна група з цим другом
								const hasPersonalGroup = activeGroups.some(group => 
									group.members.some(member => member.id === friendId)
								)
								
								// Показуємо тільки якщо персональної групи ще немає
								return !hasPersonalGroup
							}).map(friend => (
								<li
									key={friend.id}
									className='flex items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
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
											disabled={isLoadingAddPersonalGroup}
											onClick={() =>
												addPersonalGroup({
													userId: friend.senderId === user.id
													? friend?.receiverId
													: friend?.senderId
												})
											}
										>
											{t('create')}
										</Button>
									</p>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default FriendsGroups
