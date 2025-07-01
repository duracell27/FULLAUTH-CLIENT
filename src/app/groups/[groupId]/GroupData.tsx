'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
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
import { useDeleteMemberFromGroupMutation } from '@/shared/hooks/useDeleteMemberFromGroupMutation'
import { GroupMemberStatus, GroupRole } from '@/shared/types'
import colorBalance from '@/shared/utils/colorBalance'
import {
	formatBalance,
	formatNumberWithSpaces
} from '@/shared/utils/formatBalance'
import { format } from 'date-fns'
import { Edit2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
	groupId: string
}

export const GroupData = ({ groupId }: Props) => {
	const { group, isLoadingGroup } = useGroup(groupId)
	const { deleteMember, isLoadingDeleteMember } =
		useDeleteMemberFromGroupMutation(groupId)
	const { user } = useProfile()

	const handleDeleteMember = (recieverId: string) => {
		deleteMember({ values: { groupId, userId: recieverId } })
	}

	console.log(group)

	if (isLoadingGroup) {
		return <Loading />
	}

	if (!group || !user) {
		return <div>Group not found</div>
	}
	return (
		<div className='w-full max-w-[400px] flex flex-col gap-3 pb-18'>
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
				</CardHeader>
				<CardContent>
					<div>
						Group expenses:{' '}
						<span className='font-bold'>
							{formatNumberWithSpaces(group.totalExpenses)}
						</span>
					</div>
					<div>
						Your balance:{' '}
						<span className='font-bold'>
							{colorBalance({ balance: group.userTotalBalance })}
						</span>
					</div>
					<p className='text-xs'>{format(group.eventDate, 'PPP')}</p>
				</CardContent>
			</Card>

			<Card className=''>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span>Expenses</span>

						<Link
							href={`/expenses/add/${group.id}`}
							className={buttonVariants()}
						>
							Add Expense
						</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						{group.expenses.map(expense => (
							<li
								className='flex w-full items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
								key={expense.id}
							>
								<div className='flex w-full gap-2 items-center'>
									<Dialog>
										<DialogTrigger>
											<DialogTitle></DialogTitle>
											<Avatar className='cursor-pointer'>
												<AvatarImage
													src={
														expense.photoUrl
															? expense.photoUrl.replace(
																	'/upload/',
																	'/upload/w_100,h_100,c_fill,f_webp,q_80/'
															  )
															: ''
													}
												/>
												<AvatarFallback className='text-base'>
													{expense.description
														.slice(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</DialogTrigger>
										<DialogContent className='w-[90vw] max-w-none'>
											{expense.photoUrl ? (
												<Image
													src={expense.photoUrl}
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
											) : (
												<div className='flex w-full h-full justify-center'>
													<div className='flex flex-col justify-center items-center'>
														{expense.description
															.slice(0, 2)
															.toUpperCase()}
													</div>
												</div>
											)}
										</DialogContent>
									</Dialog>
									<Link
										href={`/expenses/${expense.id}`}
										className='flex items-center w-full min-w-0'
									>
										<div className='flex-1 min-w-0'>
											<h1 className='font-semibold whitespace-nowrap overflow-hidden text-ellipsis'>
												{expense.description}
											</h1>
											<p className='text-secondary-foreground text-xs'>
												{format(expense.date, 'PPP')}
											</p>
										</div>
										<div className='text-right'>
											<div className='font-bold'>
												{formatBalance(expense.amount)}
											</div>
											{colorBalance({
												balance: expense.userBalance
											})}
										</div>
									</Link>
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<Card className=''>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						<span>Members</span>
						{group.members.find(member => member.userId === user.id)
							?.role === GroupRole.ADMIN && (
							<Link
								href={`/groups/members/${group.id}`}
								className={buttonVariants()}
							>
								Add
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
										<AvatarImage
											src={member.user.picture}
										/>
										<AvatarFallback>
											{member.user.displayName
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='flex gap-2 items-center flex-1'>
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

									{group.members.find(
										member => member.userId === user.id
									)?.role === GroupRole.ADMIN &&
										member.userId !== user.id && (
											<Button
												onClick={() =>
													handleDeleteMember(
														member.userId
													)
												}
												variant={'default'}
												size={'xs'}
											>
												<X />
											</Button>
										)}
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
