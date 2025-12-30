'use client'

import React from 'react'
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
import { useGroups, useTranslations } from '@/shared/hooks'
import { useProfile } from '@/shared/hooks/useProfile'
import { Language } from '@/shared/types/user.types'
import { useAcceptGroupRequestMutation } from '@/shared/hooks/useAcceptGroupRequestMutation'
import { useGroupsRequests } from '@/shared/hooks/useGroupsRequests'
import { useRejectGroupRequestMutation } from '@/shared/hooks/useRejectGroupRequestMutation'

import colorBalance from '@/shared/utils/colorBalance'
import { formatDate, cn } from '@/shared/utils'
import { Check, X, Users } from 'lucide-react'
import Link from 'next/link'
import { IUserGroup } from '@/shared/types/groupe.types'
import { IUserSafe } from '@/shared/types/user.types'

type Props = {}

const GroupsData = (props: Props) => {
	const {
		activeGroups,
		finishedGroups,
		activeCount,
		finishedCount,
		loadMoreActive,
		loadMoreFinished,
		hasNextActive,
		hasNextFinished,
		isLoadingActive,
		isLoadingFinished,
		isFetchingNextActive,
		isFetchingNextFinished,
	} = useGroups();
	const { userGroupsRequests, isLoadingUserGroupsRequests } =
		useGroupsRequests()

	const { acceptGroupRequest, isLoadingAcceptGroupRequest } =
		useAcceptGroupRequestMutation()

	const { rejectGroupRequest, isLoadingRejectGroupRequest } =
		useRejectGroupRequestMutation()
	
	const { t } = useTranslations()
	const { user } = useProfile()

	const acceptGroupRequestHandler = (groupId: string) => {
		acceptGroupRequest(groupId)
	}
	const rejectGroupRequestHandler = (groupId: string) => {
		rejectGroupRequest(groupId)
	}

	if (isLoadingActive || isLoadingFinished || isLoadingUserGroupsRequests) {
		return <Loading />
	}


	return (
		<div className='flex flex-col gap-3 justify-start items-center pt-18'>
			{/* GROUP REQUESTS */}
			{userGroupsRequests && userGroupsRequests.length > 0 && (
				<Card className='w-full max-w-[400px]'>
					<CardHeader>
					<CardTitle>
						<span>{t('groupRequests')}</span>
					</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{userGroupsRequests.map(requestItem => (
								<li className='' key={requestItem.id}>
									<div className='border-t border-b border-ring/20 py-2 hover:bg-accent block'>
										<div className='flex gap-2 items-center'>
											<div className=''>
												<Avatar>
													<AvatarImage
														src={
															requestItem.avatarUrl.length
																? requestItem.avatarUrl.replace(
																	'/upload/',
																	'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																)
																: ''
														}
													/>
													<AvatarFallback>
														{requestItem.name
																.slice(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className='flex-1'>
												<h2 className='font-bold'>
													{requestItem.name}
												</h2>
												<span className='text-xs'>
													{formatDate(requestItem.eventDate, 'PP', user?.language || Language.EN)}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Button
													onClick={() =>
														acceptGroupRequestHandler(
															requestItem.id
														)
													}
												>
													<Check />
												</Button>
												<Button
													variant={'outline'}
													onClick={() =>
														rejectGroupRequestHandler(
															requestItem.id
														)
													}
												>
													<X />
												</Button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* ACTIVE GROUPS LIST */}
			<Card className='w-full max-w-[400px] mb-18'>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span>{t('groups')} <span className='text-sm text-muted-foreground'>({activeCount})</span></span>
						<Link href='/groups/add' className={buttonVariants()}>
							{t('add')}
						</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{activeGroups.length === 0 ? (
						<div className='text-center text-muted-foreground py-8'>
							<Users className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
							<p className='font-medium'>{t('youHaveNoGroups')}</p>
							<p className='text-sm mt-2'>
								{t('createYourFirstGroupToStart')}
							</p>
						</div>
					) : (
						<ul>
						{activeGroups.map((group: IUserGroup) => (
							<li className='' key={group.id}>
								<Link
									className={cn(
										'border-2 px-1 py-2 bg-primary/10 my-1 hover:bg-accent flex justify-between rounded-xl items-center gap-2',
										Math.abs(group.userBalance) < 0.01
											? 'border-ring/20'
											: group.userBalance > 0
											? 'border-good-green-light'
											: 'border-bad-red-light'
									)}
									href={`/groups/${group.id}`}
								>
									<div className='flex gap-2 items-center'>
										<div className=''>
											<Avatar>
												<AvatarImage
													src={
													group.avatarUrl.length
														? group.avatarUrl.replace(
															'/upload/',
															'/upload/w_100,h_100,c_fill,f_webp,q_80/'
														)
														: ''
													}
												/>
												<AvatarFallback>
													{group.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</div>
										<div className=''>
											<h2 className='font-bold'>
												{' '}
												{group.name}
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
												{group.members.map((member: IUserSafe) => (
													<li key={member.id}>
														<Avatar className='size-4'>
															<AvatarImage
																src={
																	member.picture.length
																		? member.picture.replace(
																			'/upload/',
																			'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		)
																	: ''
																}
															/>
															<AvatarFallback className='text-[9px]'>
																{member.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
													</li>
												))}
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
					)}
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
						<span>{t('finishedGroups')} <span className='text-sm text-muted-foreground'>({finishedCount})</span></span>
					</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{finishedGroups.map((group: IUserGroup) => (
								<li className='' key={group.id}>
									<Link
										className={cn(
											'border-2 px-1 py-2 bg-primary/10 my-1 hover:bg-accent flex justify-between rounded-xl items-center gap-2',
											Math.abs(group.userBalance) < 0.01
												? 'border-ring/20'
												: group.userBalance > 0
												? 'border-good-green-light'
												: 'border-bad-red-light'
										)}
										href={`/groups/${group.id}`}
									>
										<div className='flex gap-2 items-center'>
											<div className=''>
												<Avatar>
													<AvatarImage
														src={
															group.avatarUrl.length
																? group.avatarUrl.replace(
																	'/upload/',
																	'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																)
																: ''
														}
													/>
													<AvatarFallback>
														{group.name.slice(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className=''>
												<h2 className='font-bold'>
													{' '}
													{group.name}
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
													{group.members.map((member: IUserSafe) => (
														<li key={member.id}>
															<Avatar className='size-4'>
																<AvatarImage
																	src={
																	member.picture.length
																		? member.picture.replace(
																			'/upload/',
																			'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		)
																	: ''
																}
															/>
															<AvatarFallback className='text-[9px]'>
																{member.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
													</li>
												))}
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
								{isFetchingNextFinished ? t('loading') : t('loadMore')}
							</Button>
					)}
				</CardContent>
				</Card>
			)}
		</div>
	)
}

export default GroupsData
