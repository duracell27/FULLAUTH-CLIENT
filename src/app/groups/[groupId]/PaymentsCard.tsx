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
	buttonVariants,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/componets/ui'
import { useDeletePaymentMutation } from '@/shared/hooks/useDeletePaymentMutation'
import { useTranslations } from '@/shared/hooks'
import { Language, IUser } from '@/shared/types/user.types'
import { IGroup } from '@/shared/types/groupe.types'
import { formatBalance } from '@/shared/utils/formatBalance'
import { formatDate, getAvatarUrl } from '@/shared/utils'
import { ArrowRight, BadgeAlert, Trash } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
	group: IGroup
	user: IUser
}

export const PaymentsCard = ({ group, user }: Props) => {
	const { t } = useTranslations()
	const { deletePayment } = useDeletePaymentMutation(group.id)
	const [isOpenPayments, setIsOpenPayments] = useState(false)

	if (group.paymentsBetweenMembers.length === 0) return null

	return (
		<Card className=''>
			<Collapsible
				open={isOpenPayments}
				onOpenChange={setIsOpenPayments}
			>
				<CollapsibleTrigger className='w-full'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>{t('payments')}</span>
							<div
								className={buttonVariants({
									size: 'xs'
								})}
							>
								{isOpenPayments ? t('close') : t('open')}
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
										className='flex w-full items-center gap-2 font-medium border border-ring/20 py-2 hover:bg-accent rounded-xl px-1 my-1 bg-primary/10'
										key={payment.from.id + index.toString()}
									>
										<div className='flex flex-col w-full'>
											<div className='flex items-center w-full gap-2'>
												<Avatar className='cursor-pointer size-6'>
													<AvatarImage
														src={getAvatarUrl(payment.from.picture)}
													/>
													<AvatarFallback className='text-[12px]'>
														{payment.from.displayName
															.slice(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className='flex-1 text-md'>
													<span>{payment.from.displayName}</span>
												</div>

												<ArrowRight />

												<Avatar className='cursor-pointer size-6'>
													<AvatarImage
														src={getAvatarUrl(payment.to.picture)}
													/>
													<AvatarFallback className='text-[12px]'>
														{payment.to.displayName
															.slice(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className='flex-1 text-md'>
													<span>{payment.to.displayName}</span>
												</div>

												<div className='text-right'>
													<span className='font-bold'>
														{formatBalance(payment.amount)}
													</span>
												</div>
											</div>
											{payment.payments && payment.payments.length > 0 && (
												<div className='flex flex-col gap-1 mt-2'>
													{payment.payments.map((singlePayment) => (
														<div key={singlePayment.id} className='flex justify-between items-center gap-2 rounded-full bg-primary/30 px-2 py-1'>
															<span className='text-white text-xs flex items-center gap-1'>
																<span className='bg-primary rounded-full px-1'>
																	{t('createdBy')}
																</span>
																<Tooltip>
																	<TooltipTrigger asChild>
																		<Avatar className='cursor-pointer mb-0 size-4'>
																			<AvatarImage
																				src={getAvatarUrl(singlePayment.creator.picture)}
																			/>
																			<AvatarFallback className='text-[9px]'>
																				{singlePayment.creator.displayName
																					.slice(0, 2)
																					.toUpperCase()}
																			</AvatarFallback>
																		</Avatar>
																	</TooltipTrigger>
																	<TooltipContent>
																		<p>{singlePayment.creator.displayName}</p>
																	</TooltipContent>
																</Tooltip>
																<span className='font-semibold text-foreground'>{formatBalance(singlePayment.amount)}</span>
																<Popover>
																	<PopoverTrigger asChild>
																		<span className='text-[10px] opacity-70 text-foreground cursor-pointer'>
																			{formatDate(new Date(singlePayment.createdAt), 'PP', user?.language || Language.EN)}
																		</span>
																	</PopoverTrigger>
																	<PopoverContent className='w-auto'>
																		<p className='text-sm'>{formatDate(new Date(singlePayment.createdAt), 'PPpp', user?.language || Language.EN)}</p>
																	</PopoverContent>
																</Popover>
															</span>
															<AlertDialog>
																<AlertDialogTrigger asChild>
																	<Trash className='size-5 bg-bad-red text-white rounded-full p-1 cursor-pointer hover:bg-bad-red/80 hover:outline-4 hover:outline-bad-red/50' />
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>
																			{t('areYouAbsolutelySure')}
																		</AlertDialogTitle>
																		<AlertDialogDescription>
																			{t('thisActionCannotBeUndoneThisWillPermanentlyDeleteThisPayment')}
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			{t('cancel')}
																		</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() => deletePayment(singlePayment.id)}
																			className='bg-bad-red hover:bg-bad-red/80'
																		>
																			{t('continue')}
																		</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>
														</div>
													))}
												</div>
											)}

											{group.overpays &&
												group.overpays.length > 0 &&
												group.overpays.map(overpay => {
													return (
														overpay.from.id === payment.from.id &&
														overpay.to.id === payment.to.id && (
															<div
																key={overpay.from.id + overpay.to.id}
																className='flex justify-center items-center gap-2 bg-bad-red rounded-full mt-2 px-2 w-full '
															>
																<span className='text-white'>
																	<BadgeAlert className='size-5 -mt-1 inline-block' />{' '}
																	{t('overpaid')}{' '}
																	{overpay.amount}{' '}
																	{t('to')}{' '}
																	{overpay.to.displayName}
																</span>
															</div>
														)
													)
												})}
										</div>
									</li>
								)
							)}
						</ul>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}
