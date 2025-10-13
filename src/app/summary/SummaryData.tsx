'use client'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button
} from '@/shared/componets/ui'
import { useSettleUpMutation } from '@/shared/hooks/useSettleUpMutation'
import { useSummary } from '@/shared/hooks/useSummary'
import { useTranslations } from '@/shared/hooks'
import colorBalance from '@/shared/utils/colorBalance'
import { Users, Link as LinkIcon, HandCoins } from 'lucide-react'
import Link from 'next/link'

import React from 'react'


type Props = {}

export const SummaryData = (props: Props) => {
	const { summary, isLoadingSummary } = useSummary()
	const { settleUp, isLoadingSettleUp } = useSettleUpMutation()
	const { t } = useTranslations()

	if (isLoadingSummary) {
		return <div>{t('loadingSummary')}</div>
	}

	if (!summary?.length) {
		return <div>{t('noSummaryFound')}</div>
	}
	return (
		<div>
			<Accordion type='single' collapsible className='w-full'>
				<ul>
					{summary.map((summary, index) => (
						<li key={summary.user.id} className='border-y'>
							<AccordionItem
								value={summary.user.id}
								className='  '
							>
								<AccordionTrigger className='hover:no-underline cursor-pointer'>
									<div className='flex items-center gap-2 '>
										<Avatar className=''>
											<AvatarImage
												src={
													summary.user.picture
														? summary.user.picture.replace(
																'/upload/',
																'/upload/w_100,h_100,c_fill,f_webp,q_80/'
														  )
														: ''
												}
											/>
											<AvatarFallback className=''>
												{summary.user.displayName
													.slice(0, 2)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<h1 className='text-lg'>
											{summary.user.displayName}
										</h1>
										<div className='text-lg'>
											{colorBalance({
												balance: summary.totalBalance,
												fontSize: 'text-lg',
												type: 'bage'
											})}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className='flex flex-col  text-balance'>
									<Button disabled={isLoadingSettleUp} onClick={() => settleUp(summary.user.id)} size={'sm'}>{t('settleUp')} <HandCoins /></Button>
									<ul className='mt-2 space-y-1'>
										{summary.groups.map((group, index) => (
											<li
												key={group.groupInfo.id}
												className=''
											>
												<Link
													href={`/groups/${group.groupInfo.id}`}
												>
													<div className='flex items-center gap-2 pl-5'>
														<div className='flex items-center gap-1 bg-primary px-2 py-1 rounded-4xl text-background'>
															<Users className='size-3'/>
															<LinkIcon className='size-3'/>
														</div>
														<Avatar className='w-7 h-7 mt-1'>
															<AvatarImage
																src={
																	group
																		.groupInfo
																		.avatarUrl
																		? group.groupInfo.avatarUrl.replace(
																				'/upload/',
																				'/upload/w_100,h_100,c_fill,f_webp,q_80/'
																		  )
																		: ''
																}
															/>
															<AvatarFallback className='text-sm'>
																{group.groupInfo.name
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<h1 className='text-base font-semibold mb-0'>
															{
																group.groupInfo
																	.name
															}
														</h1>
														<div className='text-base'>
															{colorBalance({
																balance:
																	group.balance,
																fontSize:
																	'text-base',
																type: 'bage'
															})}
														</div>
													</div>
												</Link>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
						</li>
					))}
				</ul>
			</Accordion>
		</div>
	)
}
