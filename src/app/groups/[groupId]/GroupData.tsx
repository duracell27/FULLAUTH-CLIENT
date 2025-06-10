'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	buttonVariants,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import { useGroup, useProfile } from '@/shared/hooks'
import { GroupMemberStatus, GroupRole } from '@/shared/types'
import { format } from 'date-fns'
import { Edit2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
	groupId: string
}

export const GroupData = ({ groupId }: Props) => {
	const { group, isLoadingGroup } = useGroup(groupId)
	const { user } = useProfile()

	if (isLoadingGroup) {
		return <Loading />
	}

	if (!group || !user) {
		return <div>Group not found</div>
	}
	return (
		<div className='w-full max-w-[400px] flex flex-col gap-3 '>
			<Card className=''>
				<CardHeader>
					<CardTitle className='flex gap-2 items-center justify-between'>
						<h2 className='flex items-center gap-2'>
							{group.name}{' '}
							{group.members.some(
								member =>
									member.userId === user?.id &&
									member.role === GroupRole.ADMIN
							) ? (
								<Link href={`/groups/edit/${group.id}`}>
									<Edit2 className='text-xs' />
								</Link>
							) : (
								''
							)}
						</h2>
						<Dialog>
							<DialogTrigger>
								<DialogTitle></DialogTitle>
								<Avatar>
									<AvatarImage
										src={
											group.avatarUrl
												? group.avatarUrl.replace(
														'/upload/',
														'/upload/w_100,h_100,c_fill,f_webp,q_80/'
												  )
												: ''
										}
									/>
									<AvatarFallback className='text-base'>
										{group.name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DialogTrigger>
							<DialogContent className='w-[90vw] max-w-none'>
								<Image
									src={group.avatarUrl || ''}
									alt=''
									width={0}
									height={0}
									sizes='100vw'
									style={{
										width: '100%',

										height: 'auto',
										borderRadius: '8px'
									}}
								/>
							</DialogContent>
						</Dialog>
					</CardTitle>
					<p className='text-xs'>{format(group.eventDate, 'PPP')}</p>
				</CardHeader>
			</Card>

			<Card className=''>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span>Members</span>
						<Link href={`/groups/members/${group.id}`} className={buttonVariants()} >Add</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						{group.members.map(member => (
							<li
								className='flex items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
								key={member.userId}
							>
								<div className='flex gap-2 items-center'>
									<Avatar>
										<AvatarImage
											src={member.user.picture}
										/>
										<AvatarFallback>
											{member.user.displayName
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='flex gap-2 items-center'>
										{member.status ===
										GroupMemberStatus.PENDING ? (
											<>
												<span className='font-bold text-muted-foreground'>
													{member.user.displayName}
												</span>
												<Badge className='text-xs bg-muted-foreground'>
													invited
												</Badge>
											</>
										) : (
											<span className='font-bold'>
												{member.user.displayName}
											</span>
										)}

										{member.role === GroupRole.ADMIN && (
											<Badge className='text-xs'>
												admin
											</Badge>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
