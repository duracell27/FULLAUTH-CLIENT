'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	buttonVariants,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/componets/ui'
import { useTranslations } from '@/shared/hooks'
import { Language, IUser } from '@/shared/types/user.types'
import { IGroup } from '@/shared/types/groupe.types'
import colorBalance from '@/shared/utils/colorBalance'
import { formatBalance } from '@/shared/utils/formatBalance'
import { formatDate, getAvatarUrl } from '@/shared/utils'
import { Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
	group: IGroup
	user: IUser
}

export const ExpensesCard = ({ group, user }: Props) => {
	const { t } = useTranslations()

	return (
		<Card className=''>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					<span>{t('expenses')}</span>

					<Link
						href={`/expenses/add/${group.id}`}
						className={buttonVariants()}
						aria-disabled={group.isLocked || group.isFinished}
						tabIndex={group.isLocked || group.isFinished ? -1 : 0}
						style={
							group.isLocked || group.isFinished
								? { pointerEvents: 'none', opacity: 0.6 }
								: {}
						}
					>
						{(group.isLocked || group.isFinished) && (
							<Lock className='mr inline-block' />
						)}
						{t('addExpenseButton')}
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					{group.expenses.map(expense => (
						<li
							className='flex w-full items-center gap-2 font-medium border px-1 border-ring/20 py-2 bg-primary/10 my-1 hover:bg-accent rounded-xl'
							key={expense.id}
						>
							<div className='flex w-full gap-2 items-center'>
								<Dialog>
									<DialogTrigger>
										<DialogTitle></DialogTitle>
										<Avatar className='cursor-pointer'>
											<AvatarImage
												src={getAvatarUrl(expense.photoUrl)}
											/>
											<AvatarFallback className='text-base'>
												{expense.description
													.slice(0, 2)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</DialogTrigger>
									<DialogContent className='w-[90vw] max-w-none rounded-md'>
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
													maxHeight: '75vh',
													objectFit: 'contain'
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
													<span>{t('paidBy')}</span>
												</div>
											</li>
											{expense.payers &&
												expense.payers.length > 0 &&
												expense.payers.map(payer => (
													<li key={payer.payer.id}>
														<Tooltip>
															<TooltipTrigger asChild>
																<Avatar className='size-4'>
																	<AvatarImage
																		src={
																			payer.payer.picture.length
																				? getAvatarUrl(payer.payer.picture)
																				: ''
																		}
																	/>
																	<AvatarFallback className='text-[9px]'>
																		{payer.payer.displayName
																			.slice(0, 2)
																			.toUpperCase()}
																	</AvatarFallback>
																</Avatar>
															</TooltipTrigger>
															<TooltipContent>
																<p>{payer.payer.displayName}</p>
															</TooltipContent>
														</Tooltip>
													</li>
												))}
										</ul>
										<div
											onClick={e => {
												e.stopPropagation()
												e.preventDefault()
											}}
											onMouseDown={e => {
												e.stopPropagation()
											}}
											className='inline-block'
										>
											<Popover>
												<PopoverTrigger asChild>
													<span className='text-secondary-foreground text-xs pl-1 cursor-pointer'>
														{t('on')}{' '}
														{formatDate(
															expense.date,
															'PP',
															user?.language || Language.EN
														)}
													</span>
												</PopoverTrigger>
												<PopoverContent className='w-auto'>
													<p className='text-sm'>{formatDate(expense.date, 'PPpp', user?.language || Language.EN)}</p>
												</PopoverContent>
											</Popover>
										</div>
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
	)
}
