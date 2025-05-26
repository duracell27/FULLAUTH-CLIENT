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
import { useGroups } from '@/shared/hooks'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'

type Props = {}

const GroupsPage = (props: Props) => {
	const { userGroups, isLoadingUserGroups } = useGroups()
	if (isLoadingUserGroups) {
		return <Loading />
	}

	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span> Groups</span>
						<Link href='/groups/add' className={buttonVariants()} >Add</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						{userGroups &&
							userGroups.map(group => (
								<li className='' key={group.id}>
									<Link
										className='border-t border-b border-ring/20 py-2 hover:bg-accent block'
										href={`/groups/${group.id}`}
									>
										<div className='flex gap-2 items-center'>
											<div className=''>
												<Avatar>
													<AvatarImage
														src={group.avatarUrl}
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
									</Link>
								</li>
							))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}

export default GroupsPage
