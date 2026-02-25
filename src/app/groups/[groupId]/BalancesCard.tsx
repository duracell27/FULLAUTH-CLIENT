'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
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
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/shared/componets/ui'
import { useTranslations } from '@/shared/hooks'
import { Language, IUser } from '@/shared/types/user.types'
import { IGroup } from '@/shared/types/groupe.types'
import colorBalance from '@/shared/utils/colorBalance'
import { formatBalance } from '@/shared/utils/formatBalance'
import { getAvatarUrl } from '@/shared/utils'
import { HandCoins, MoveRight } from 'lucide-react'
import React, { useState } from 'react'
import { PaymentForm } from './PaymentForm'

type Props = {
	group: IGroup
	user: IUser
}

export const BalancesCard = ({ group, user }: Props) => {
	const { t } = useTranslations()
	const [isOpenBalances, setIsOpenBalances] = useState(false)
	const [openPaymentDialog, setOpenPaymentDialog] = useState<string | null>(null)

	const handleOpenPaymentDialog = (userId: string) => {
		setOpenPaymentDialog(userId)
	}

	const handleClosePaymentDialog = () => {
		setOpenPaymentDialog(null)
	}

	if (group.memberBalanceDetails.length === 0) return null

	return (
		<Card className=''>
			<Collapsible
				open={isOpenBalances}
				onOpenChange={setIsOpenBalances}
			>
				<CollapsibleTrigger className='w-full'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>{t('balances')}</span>
							<div
								className={buttonVariants({
									size: 'xs'
								})}
							>
								{isOpenBalances ? t('close') : t('open')}
							</div>
						</CardTitle>
					</CardHeader>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<CardContent>
						<Accordion type='single' collapsible className='w-full '>
							{group.memberBalanceDetails.map(memberBalance => (
								<AccordionItem
									key={memberBalance.user.id}
									value={memberBalance.user.id}
								>
									<AccordionTrigger className='hover:no-underline cursor-pointer'>
										<div className='flex items-center gap-2 w-full'>
											<Avatar className='cursor-pointer'>
												<AvatarImage
													src={getAvatarUrl(memberBalance.user.picture)}
												/>
												<AvatarFallback className='text-base'>
													{memberBalance.user.displayName
														.slice(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className='flex-1'>
												<span>
													{memberBalance.user.displayName}{' '}
												</span>

												{memberBalance.totalBalance > 0 ? (
													<span className='inline-block'>
														{t('getsBack')}{' '}
														<span>
															{colorBalance({
																balance: memberBalance.totalBalance
															})}
														</span>{' '}
														{t('inTotal')}
													</span>
												) : (
													<span className=''>
														{t('owes')}{' '}
														{colorBalance({
															balance: memberBalance.totalBalance
														})}{' '}
														{t('inTotal')}
													</span>
												)}
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='flex flex-col gap-4 text-balance'>
										<ul className='mt-2 space-y-1'>
											{memberBalance.debtDetails.map(debtDetail => (
												<li
													key={debtDetail.user.id}
													className='flex items-center gap-2 pl-10 mb-2'
												>
													<Avatar className='cursor-pointer mb-0'>
														<AvatarImage
															src={getAvatarUrl(debtDetail.user.picture)}
														/>
														<AvatarFallback className='text-base'>
															{debtDetail.user.displayName
																.slice(0, 2)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<p className='w-full'>
														{debtDetail.user.displayName}{' '}
														{debtDetail.type === 'owes_to_member' ? (
															<>
																<span className='text-good-green whitespace-nowrap font-semibold'>
																	{t('owes')}

																	+
																	<span className=''>
																		{formatBalance(debtDetail.amount)}
																	</span>
																</span>{' '}
																{t('to')}{' '}
																<span className='text-neutral-grey text-xs'>
																	<MoveRight className='size-4 inline-block' />
																	<HandCoins className='size-4 inline-block' />
																	{memberBalance.user.displayName}
																</span>
															</>
														) : (
															<>
																<span className='text-bad-red whitespace-nowrap font-semibold'>
																	{t('lended')}

																	-
																	<span className=''>
																		{formatBalance(debtDetail.amount)}
																	</span>
																</span>{' '}
																{t('to')}{' '}
																<span className='text-neutral-grey text-xs'>
																	<MoveRight className='size-4 inline-block' />
																	<HandCoins className='size-4 inline-block' />
																	{memberBalance.user.displayName}
																</span>
																<Dialog
																	open={openPaymentDialog === debtDetail.user.id}
																	onOpenChange={open => {
																		if (open) {
																			handleOpenPaymentDialog(debtDetail.user.id)
																		} else {
																			handleClosePaymentDialog()
																		}
																	}}
																>
																	<DialogTrigger>
																		<span className='ml-3 cursor-pointer px-2 py-1 bg-primary rounded-full text-background text-xs'>
																			{t('pay')}{' '}
																			<HandCoins className='size-4 ml-1 inline-block' />
																		</span>
																	</DialogTrigger>
																	<DialogContent>
																		<DialogTitle></DialogTitle>
																		<div>
																			<h1>
																				<PaymentForm
																					amount={debtDetail.amount}
																					groupId={group.id}
																					creditor={debtDetail.user}
																					debtor={memberBalance.user}
																					closeDialog={handleClosePaymentDialog}
																				/>
																			</h1>
																		</div>
																	</DialogContent>
																</Dialog>
															</>
														)}
													</p>
												</li>
											))}
										</ul>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}
