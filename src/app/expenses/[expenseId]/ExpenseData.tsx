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
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import { useDeleteExpenseMutation } from '@/shared/hooks/useDeleteExpenseMutation'
import { useExpense } from '@/shared/hooks/useExpense'
import { useGroup } from '@/shared/hooks/useGroup'
import { useProfile, useTranslations } from '@/shared/hooks'
import { GroupRole } from '@/shared/types/groupe.types'
import { Language } from '@/shared/types/user.types'
import { formatBalance } from '@/shared/utils/formatBalance'
import { formatDate } from '@/shared/utils'
import { Calendar, ContactRound, Eye, HandCoins, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
	expenseId: string
}

const ExpenseData = ({ expenseId }: Props) => {
	const { expense, isLoadingExpense } = useExpense(expenseId)

	const { user, isLoadingProfile } = useProfile()
	const { group, isLoadingGroup } = useGroup(expense?.groupId || '')
	const { t } = useTranslations()

	const { deleteExpense, isLoadingDeleteExpense } = useDeleteExpenseMutation(
		expense?.groupId || ''
	)
	if (isLoadingExpense || isLoadingProfile || isLoadingGroup) {
		return <div>{t('loading')}</div>
	}

	if (!expense || !user || !group) {
		return <div>{t('expenseNotFound')}</div>
	}

	const isCreator = user.id === expense.creator.id
	const isGroupAdmin = group.members?.some(
		member => member.userId === user.id && member.role === GroupRole.ADMIN
	)
	const canEditOrDelete = isCreator || isGroupAdmin

	const deleteExpenseHandler = async (expenseId: string) => {
		await deleteExpense(expenseId)
	}
	return (
		<div className='w-full max-w-[400px] flex flex-col gap-3 pb-18'>
			<BackButton />
			<Card className=''>
				<CardHeader className='p-0'>
					<CardTitle
						className={`flex relative gap-2 items-center justify-between h-50 rounded-lg px-5 ${
							expense.photoUrl === ''
								? 'bg-primary/40'
								: 'bg-cover bg-center'
						}`}
						style={
							expense.photoUrl !== ''
								? {
										backgroundImage: `url(${expense.photoUrl})`
								  }
								: {}
						}
					>
						{expense.photoUrl === '' && (
							<div className='w-full flex items-center justify-center  text-background '>
								<span className='bg-primary rounded-full px-5 py-2'>
									{expense.description
										.slice(0, 2)
										.toUpperCase()}
								</span>
							</div>
						)}
						<div className='absolute -bottom-2 inset-x-5 gap-5 flex justify-between items-center  text-background bg-primary rounded-full px-5 py-2'>
							<h1 className=''>{expense.description}</h1>
							<span>{formatBalance(expense.amount)}</span>
						</div>

						{expense.photoUrl !== '' && (
							<div className='absolute top-3 right-3'>
								<Dialog>
									<DialogTrigger>
										<DialogTitle></DialogTitle>
										<div className='rounded-full bg-white/30 text-background/50 p-1'>
											<Eye />
										</div>
									</DialogTrigger>
									<DialogContent className='w-[90vw] max-w-none rounded-md'>
										<Image
											src={expense.photoUrl || ''}
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
									</DialogContent>
								</Dialog>
							</div>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='mt-5 flex justify-between items-center gap-2'>
						<div className='text-neutral-grey space-y-2'>
							<p className='text-xs flex items-center gap-2'>
								<Calendar className='size-5' />
								{formatDate(expense.date, 'PP', user?.language || Language.EN)}
							</p>
							<p className='text-xs flex items-center gap-2'>
								<ContactRound className='size-5' />
								{t('createdBy')}
								<Avatar className='w-5 h-5'>
									<AvatarImage
										src={
											expense.creator.picture
												? expense.creator.picture.replace(
														'/upload/',
														'/upload/w_100,h_100,c_fill,f_webp,q_80/'
												  )
												: ''
										}
									/>
									<AvatarFallback className='text-xs'>
										{expense.creator.displayName
											.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								{expense.creator.displayName}
							</p>
						</div>
						<div className='bg-primary text-background px-3 py-2 rounded-lg text-xs'>
							{t(expense.splitType.toLowerCase())}
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className=''>
				<CardHeader>
					<CardTitle className='flex justify-between items-center pb-1'>
						<span>{t('paymentOverview')}</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className='space-y-3'>
						{expense.payers.map(payer => (
							<li
								key={payer.id}
								className='flex items-center gap-2'
							>
								<div className=''>
									<Avatar>
										<AvatarImage
											src={
												payer.payer.picture
													? payer.payer.picture.replace(
															'/upload/',
															'/upload/w_100,h_100,c_fill,f_webp,q_80/'
													  )
													: ''
											}
										/>
										<AvatarFallback className='text-xs'>
											{payer.payer.displayName
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className='w-full'>
									<p>{payer.payer.displayName}</p>
									<div className='h-3 relative flex items-center bg-good-green/20 rounded-3xl pl-1'>
										<div
											className='h-1 bg-good-green rounded-l-full'
											style={{
												width: `${
													(payer.amount * 100) /
													expense.amount
												}%`
											}}
										></div>
										<div className='bg-good-green px-1 text-background rounded-full text-xs'>
											{formatBalance(payer.amount)}
										</div>
									</div>
								</div>
							</li>
						))}
						{expense.splits.map(splitter => (
							<li
								key={splitter.id}
								className='flex items-center gap-2'
							>
								<div className=''>
									<Avatar>
										<AvatarImage
											src={
												splitter.debtor.picture
													? splitter.debtor.picture.replace(
															'/upload/',
															'/upload/w_100,h_100,c_fill,f_webp,q_80/'
													  )
													: ''
											}
										/>
										<AvatarFallback className='text-xs'>
											{splitter.debtor.displayName
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className='w-full'>
									<div className='flex items-center gap-2'>
										<p>{splitter.debtor.displayName}</p>
										<div className='text-xs text-neutral-grey flex items-center gap-1'>
											<MoveRight className='size-4' />
											<HandCoins className='size-4' />
											<p>
												{splitter.creditor.displayName}
											</p>
										</div>
									</div>
									<div
										className='h-3 relative flex items-center bg-bad-red/20 rounded-3xl pl-1'
										style={{
											width: `${
												(splitter.amount * 100) /
												expense.amount
											}%`
										}}
									>
										<div className='h-1 bg-bad-red rounded-l-full w-full'></div>
										<div className='bg-bad-red px-1 text-background rounded-full text-xs'>
											{formatBalance(splitter.amount)}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='flex justify-center items-center gap-3 pt-3'>
					<Link
						className={`${!canEditOrDelete ? 'pointer-events-none' : ''}`}
						href={`/expenses/edit/${expense.groupId}/${expense.id}`}
					>
						<Button className='px-5' disabled={!canEditOrDelete}>
							{t('edit')}
						</Button>
					</Link>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								className='px-5 '
								variant={'danger'}
								disabled={!canEditOrDelete}
							>
								{t('delete')}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{t('areYouAbsolutelySure')}
								</AlertDialogTitle>
								<AlertDialogDescription>
									{t('thisActionCannotBeUndone')}{' '}
									<span className='font-black text-lg'>
										{t('expense')}
									</span>
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										deleteExpenseHandler(expense.id)
									}
									className='bg-bad-red hover:bg-bad-red/80'
								>
									{t('continue')}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardContent>
			</Card>
		</div>
	)
}

export default ExpenseData
