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
import { useGroups } from '@/shared/hooks'
import { useAcceptGroupRequestMutation } from '@/shared/hooks/useAcceptGroupRequestMutation'
import { useGroupsRequests } from '@/shared/hooks/useGroupsRequests'
import { useRejectGroupRequestMutation } from '@/shared/hooks/useRejectGroupRequestMutation'

import colorBalance from '@/shared/utils/colorBalance'
import { format } from 'date-fns'
import { Check, X } from 'lucide-react'
import Link from 'next/link'


type Props = {}

const GroupsData = (props: Props) => {
	const { userGroups, isLoadingUserGroups } = useGroups()
	const { userGroupsRequests, isLoadingUserGroupsRequests } =
		useGroupsRequests()

	const { acceptGroupRequest, isLoadingAcceptGroupRequest } =
		useAcceptGroupRequestMutation()

	const { rejectGroupRequest, isLoadingRejectGroupRequest } =
		useRejectGroupRequestMutation()

	const acceptGroupRequestHandler = (groupId: string) => {
		acceptGroupRequest(groupId)
	}
	const rejectGroupRequestHandler = (groupId: string) => {
		rejectGroupRequest(groupId)
	}

	if (isLoadingUserGroups || isLoadingUserGroupsRequests) {
		return <Loading />
	}

	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			{/* GROUP REQUESTS */}
			{userGroupsRequests && userGroupsRequests.length > 0 && (
				<Card className='w-full max-w-[400px]'>
					<CardHeader>
						<CardTitle>
							<span>Group requests</span>
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
															requestItem
																.avatarUrl
																.length
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
													{format(
														requestItem.eventDate,
														'PPP'
													)}
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

			{/* GROUPS LIST */}
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span> Groups</span>
						<Link href='/groups/add' className={buttonVariants()}>
							Add
						</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{userGroups?.length === 0 && <div>You have no groups</div>}
					<ul>
						{userGroups &&
							userGroups.map(group => (
								<li className='' key={group.id}>
									<Link
										className='border-t border-b border-ring/20 py-2 hover:bg-accent flex justify-between items-center gap-2'
										href={`/groups/${group.id}`}
									>
										<div className='flex gap-2 items-center'>
											<div className=''>
												<Avatar>
													<AvatarImage
														src={
															group.avatarUrl
																.length
																? group.avatarUrl.replace(
																		'/upload/',
																		'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																  )
																: ''
														}
													/>
													<AvatarFallback>
														{group.name
															.slice(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className=''>
												<h2 className='font-bold'>
													{' '}
													{group.name}
												</h2>
												<span className='text-xs'>
													{format(
														group.eventDate,
														'PPP'
													)}
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
														member => (
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
				</CardContent>
			</Card>
		</div>
	)
}

export default GroupsData
