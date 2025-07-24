'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
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
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import { useGroup, useProfile } from '@/shared/hooks'
import { useDeleteGroupMutation } from '@/shared/hooks/useDeleteGroupMutation'
import { useDeleteMemberFromGroupMutation } from '@/shared/hooks/useDeleteMemberFromGroupMutation'
import { GroupMemberStatus, GroupRole } from '@/shared/types'
import colorBalance from '@/shared/utils/colorBalance'
import {
	formatBalance,
	formatNumberWithSpaces
} from '@/shared/utils/formatBalance'

import { format } from 'date-fns'
import {
	ArrowRight,
	BadgeAlert,
	Edit2,
	Eye,
	HandCoins,
	MoveRight,
	Trash,
	X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { PaymentForm } from './PaymentForm'

type Props = {
	groupId: string
}

export const GroupData = ({ groupId }: Props) => {
	const { group, isLoadingGroup } = useGroup(groupId)
	const { deleteMember, isLoadingDeleteMember } =
		useDeleteMemberFromGroupMutation(groupId)
	const { user } = useProfile()

	const [isOpenBalances, setIsOpenBalances] = useState(false)
	const [isOpenPayments, setIsOpenPayments] = useState(false)
	const [isOpenAddPayment, setIsOpenAddPayment] = useState(false)

	const handleDeleteMember = (recieverId: string) => {
		deleteMember({ values: { groupId, userId: recieverId } })
	}

	const { deleteGroup, isLoadingDeleteGroup } = useDeleteGroupMutation()
	const handleDeleteGroup = () => {
		deleteGroup(groupId)
	}

	if (isLoadingGroup) {
		return <Loading />
	}

	if (!group || !user) {
		return <div>Group not found</div>
	}
	return (
		<div className='w-full max-w-[400px] flex flex-col gap-3 pb-18'>
			{/* group info */}
			<Card className=''>
				<CardHeader className='p-0'>
					<CardTitle
						className={`flex relative gap-2 items-center justify-between h-50 rounded-lg px-5 ${
							group.avatarUrl === ''
								? 'bg-primary/40'
								: 'bg-cover bg-center'
						}`}
						style={
							group.avatarUrl !== ''
								? {
										backgroundImage: `url(${group.avatarUrl})`
								  }
								: {}
						}
					>
						{group.avatarUrl === '' && (
							<div className='w-full flex items-center justify-center  text-background '>
								<span className='bg-primary rounded-full px-5 py-2'>
									{group.name.slice(0, 2).toUpperCase()}
								</span>
							</div>
						)}
						<div className='absolute -bottom-2 inset-x-5 gap-5 flex justify-between items-center  text-background bg-primary rounded-full px-5 py-2'>
							<h1 className=''>{group.name}</h1>
							<span>
								{group.members.some(
									member =>
										member.userId === user?.id &&
										member.role === GroupRole.ADMIN
								) ? (
									<div className='flex gap-2 items-center'>
										<Link href={`/groups/edit/${group.id}`}>
											<Button size={'xs'}>
												<Edit2 className='size-4' />
											</Button>
										</Link>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													size={'xs'}
													className='bg-bad-red hover:bg-bad-red/80'
												>
													<Trash className='size-4' />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will
														permanently delete this
														group.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleDeleteGroup()
														}
														className='bg-bad-red hover:bg-bad-red/80'
													>
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								) : (
									''
								)}
							</span>
						</div>

						{group.avatarUrl !== '' && (
							<div className='absolute top-3 right-3'>
								<Dialog>
									<DialogTrigger>
										<DialogTitle></DialogTitle>
										<div className='rounded-full bg-white/30 text-background/50 p-1'>
											<Eye />
										</div>
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
							</div>
						)}
					</CardTitle>
				</CardHeader>

				<CardContent className='mt-4'>
					<div className='flex items-center gap-2'>
						Group expenses:{' '}
						<span className='font-bold'>
							{formatNumberWithSpaces(group.totalExpenses)}
						</span>
					</div>
					<div className='flex items-center gap-2'>
						Your balance:{' '}
						<span className='font-bold'>
							{colorBalance({ balance: group.userTotalBalance })}
						</span>
					</div>
					<p className='text-xs mt-1'>
						{format(group.eventDate, 'PPP')}
					</p>
				</CardContent>
			</Card>

			{/* payments between members */}
			{group.paymentsBetweenMembers.length > 0 && (
				<Card className=''>
					<Collapsible
						open={isOpenPayments}
						onOpenChange={setIsOpenPayments}
					>
						<CollapsibleTrigger className='w-full'>
							<CardHeader>
								<CardTitle className='flex justify-between items-center'>
									<span>Payments</span>
									<div
										className={buttonVariants({
											size: 'xs'
										})}
									>
										{isOpenPayments ? 'Close' : 'Open'}
									</div>
								</CardTitle>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent>
								<ul>
									{group.paymentsBetweenMembers.map(
										(payment, index) => (
											<li
												className='flex w-full items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
												key={
													payment.from.id +
													index.toString()
												}
											>
												<div className='flex flex-col'>
													<div className='flex items-center w-full gap-2'>
														<Avatar className='cursor-pointer'>
															<AvatarImage
																src={
																	payment.from
																		.picture
																		? payment.from.picture.replace(
																				'/upload/',
																				'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		  )
																		: ''
																}
															/>
															<AvatarFallback className='text-base'>
																{payment.from.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className='flex-1'>
															<span>
																{
																	payment.from
																		.displayName
																}
															</span>
														</div>

														<ArrowRight />

														<Avatar className='cursor-pointer'>
															<AvatarImage
																src={
																	payment.to
																		.picture
																		? payment.to.picture.replace(
																				'/upload/',
																				'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		  )
																		: ''
																}
															/>
															<AvatarFallback className='text-base'>
																{payment.to.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className='flex-1'>
															<span>
																{
																	payment.to
																		.displayName
																}
															</span>
														</div>

														<div className='text-right'>
															<span className='font-bold'>
																{formatBalance(
																	payment.amount
																)}
															</span>
														</div>
													</div>
													{group.overpays &&
														group.overpays.length >
															0 &&
														group.overpays.map(
															overpay => {
																return (
																	overpay.from
																		.id ===
																		payment
																			.from
																			.id &&
																	overpay.to
																		.id ===
																		payment
																			.to
																			.id && (
																		<div
																			key={
																				overpay
																					.from
																					.id +
																				overpay
																					.to
																					.id
																			}
																			className='flex justify-center items-center gap-2 bg-bad-red rounded-full px-2 w-full '
																		>
																			<span className='text-white'>
																				<BadgeAlert className='size-5 -mt-1 inline-block' />{' '}
																				overpaid{' '}
																				{
																					overpay.amount
																				}{' '}
																				to{' '}
																				{
																					overpay
																						.to
																						.displayName
																				}
																			</span>
																		</div>
																	)
																)
															}
														)}
												</div>
											</li>
										)
									)}
								</ul>
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>
			)}

			{/* balances */}
			{group.memberBalanceDetails.length > 0 && (
				<Card className=''>
					<Collapsible
						open={isOpenBalances}
						onOpenChange={setIsOpenBalances}
					>
						<CollapsibleTrigger className='w-full'>
							<CardHeader>
								<CardTitle className='flex justify-between items-center'>
									<span>Balances</span>
									<div
										className={buttonVariants({
											size: 'xs'
										})}
									>
										{isOpenBalances ? 'Close' : 'Open'}
									</div>
								</CardTitle>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent>
								<Accordion type='multiple' className='w-full '>
									{group.memberBalanceDetails.map(
										memberBalance => (
											<AccordionItem
												key={memberBalance.user.id}
												value={memberBalance.user.id}
											>
												<AccordionTrigger className='hover:no-underline cursor-pointer'>
													<div className='flex items-center gap-2 w-full'>
														<Avatar className='cursor-pointer'>
															<AvatarImage
																src={
																	memberBalance
																		.user
																		.picture
																		? memberBalance.user.picture.replace(
																				'/upload/',
																				'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		  )
																		: ''
																}
															/>
															<AvatarFallback className='text-base'>
																{memberBalance.user.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className='flex-1'>
															<span>
																{
																	memberBalance
																		.user
																		.displayName
																}{' '}
															</span>

															{memberBalance.totalBalance >
															0 ? (
																<span className='inline-block'>
																	gets back{' '}
																	<span>
																		{colorBalance(
																			{
																				balance:
																					memberBalance.totalBalance
																			}
																		)}
																	</span>{' '}
																	in total
																</span>
															) : (
																<span className=''>
																	owes{' '}
																	{colorBalance(
																		{
																			balance:
																				memberBalance.totalBalance
																		}
																	)}{' '}
																	in total
																</span>
															)}
														</div>
													</div>
												</AccordionTrigger>
												<AccordionContent className='flex flex-col gap-4 text-balance'>
													<ul className='mt-2 space-y-1'>
														{memberBalance.debtDetails.map(
															debtDetail => (
																<li
																	key={
																		debtDetail
																			.user
																			.id
																	}
																	className='flex items-center gap-2 pl-10 mb-2'
																>
																	<Avatar className='cursor-pointer mb-0'>
																		<AvatarImage
																			src={
																				debtDetail
																					.user
																					.picture
																					? debtDetail.user.picture.replace(
																							'/upload/',
																							'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																					  )
																					: ''
																			}
																		/>
																		<AvatarFallback className='text-base'>
																			{debtDetail.user.displayName
																				.slice(
																					0,
																					2
																				)
																				.toUpperCase()}
																		</AvatarFallback>
																	</Avatar>
																	<p className='w-full'>
																		{
																			debtDetail
																				.user
																				.displayName
																		}{' '}
																		{debtDetail.type ===
																		'owes_to_member' ? (
																			<>
																				<span className='text-good-green whitespace-nowrap font-semibold'>
																					owes
																					+
																					<span className=''>
																						{formatBalance(
																							debtDetail.amount
																						)}
																					</span>
																				</span>{' '}
																				to{' '}
																				<span className='text-neutral-grey text-xs'>
																					<MoveRight className='size-4 inline-block' />
																					<HandCoins className='size-4 inline-block' />
																					{
																						memberBalance
																							.user
																							.displayName
																					}
																				</span>
																			</>
																		) : (
																			<>
																				<span className='text-bad-red whitespace-nowrap font-semibold'>
																					lended
																					-
																					<span className=''>
																						{formatBalance(
																							debtDetail.amount
																						)}
																					</span>
																				</span>{' '}
																				to{' '}
																				<span className='text-neutral-grey text-xs'>
																					<MoveRight className='size-4 inline-block' />
																					<HandCoins className='size-4 inline-block' />
																					{
																						memberBalance
																							.user
																							.displayName
																					}
																				</span>
																				<Dialog
																					open={
																						isOpenAddPayment
																					}
																					onOpenChange={
																						setIsOpenAddPayment
																					}
																				>
																					<DialogTrigger>
																						<span className='ml-3 cursor-pointer px-2 py-1 bg-primary rounded-full text-background text-xs'>
																							pay{' '}
																							<HandCoins className='size-4 ml-1 inline-block' />
																						</span>
																					</DialogTrigger>
																					<DialogContent>
																						<DialogTitle></DialogTitle>
																						<div>
																							<h1>
																								<PaymentForm
																									amount={
																										debtDetail.amount
																									}
																									groupId={
																										group.id
																									}
																									creditor={
																										debtDetail.user
																									}
																									debtor={
																										memberBalance.user
																									}
																									closeDialog={
																										setIsOpenAddPayment
																									}
																								/>
																							</h1>
																						</div>
																					</DialogContent>
																				</Dialog>
																			</>
																		)}
																	</p>
																</li>
															)
														)}
													</ul>
												</AccordionContent>
											</AccordionItem>
										)
									)}
								</Accordion>
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>
			)}

			{/* expenses */}
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

											<ul className='inline-flex gap-1 items-start justify-start bg-primary/40 p-0.5 rounded-full'>
												<li key={'memberCount'}>
													<div className='h-4 px-1 bg-primary text-center rounded-full text-background text-xs'>
														<span>paid by</span>
													</div>
												</li>
												{expense.payers &&
													expense.payers.length > 0 &&
													expense.payers.map(
														payer => (
															<li
																key={
																	payer.payer
																		.id
																}
															>
																<Avatar className='size-4'>
																	<AvatarImage
																		src={
																			payer
																				.payer
																				.picture
																				.length
																				? payer.payer.picture.replace(
																						'/upload/',
																						'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																				  )
																				: ''
																		}
																	/>
																	<AvatarFallback className='text-[9px]'>
																		{payer.payer.displayName
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
											</ul>
											<span className='text-secondary-foreground text-xs pl-1'>
												on {format(expense.date, 'PPP')}
											</span>
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

			{/* members */}
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

									<AlertDialog>
										<AlertDialogTrigger asChild>
											{group.members.find(
												member =>
													member.userId === user.id
											)?.role === GroupRole.ADMIN &&
												member.userId !== user.id && (
													<Button
														type='button'
														variant={'default'}
														size={'xs'}
													>
														<X />
													</Button>
												)}
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be
													undone. This will remove
													this member from the group.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() =>
														handleDeleteMember(
															member.userId
														)
													}
													className='bg-bad-red hover:bg-bad-red/80'
												>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
