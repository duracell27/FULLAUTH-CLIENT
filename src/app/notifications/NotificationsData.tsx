'use client'

import React from 'react'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui'

import { formatDate } from '@/shared/utils'
import { Bell, Check, Clock, Link2, Trash, Eye } from 'lucide-react'

import { useTranslations } from '@/shared/hooks'
import { useProfile } from '@/shared/hooks/useProfile'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { Language } from '@/shared/types/user.types'
import { Loading } from '@/shared/componets/ui/Loading'
import { cn } from '@/shared/utils'
import { useRouter } from 'next/navigation'
import { useMarkAllNotificationsAsReadMutation } from '@/shared/hooks/useMarkAllNotificationsAsReadMutation'
import { useDeleteNotificationMutation } from '@/shared/hooks/useDeleteNotificationMutation'
import { useDeleteAllNotificationsMutation } from '@/shared/hooks/useDeleteAllNotificationsMutation'
import { useMarkNotificationAsReadMutation } from '@/shared/hooks/useMarkNotificationAsReadMutation'

type Props = {}

// Функція для заміни плейсхолдерів в тексті повідомлення
const replaceMessagePlaceholders = (message: string, metadata: any): string => {
	if (!metadata) return message

	let result = message

	// Замінюємо всі можливі плейсхолдери
	const replacements: Record<string, any> = {
		'{expenseDescription}': metadata.expenseDescription,
		'{groupName}': metadata.groupName,
		'{amount}': metadata.amount,
		'{totalAmount}': metadata.totalAmount,
		'{count}': metadata.count,
		'{senderName}': metadata.senderName,
		'{receiverName}': metadata.receiverName,
		'{inviterName}': metadata.inviterName,
		'{removerName}': metadata.removerName
	}

	Object.entries(replacements).forEach(([placeholder, value]) => {
		if (value !== undefined && value !== null) {
			result = result.replace(new RegExp(placeholder, 'g'), String(value))
		}
	})

	return result
}

const NotificationsData = (props: Props) => {
	const router = useRouter()
	const { notifications, isLoadingNotifications } = useNotifications()
	const { markAllNotificationsAsRead, isLoadingMarkAllNotificationsAsRead } =
		useMarkAllNotificationsAsReadMutation()

	const { markNotificationAsRead, isLoadingMarkNotificationAsRead } =
		useMarkNotificationAsReadMutation()

	const { deleteNotification, isLoadingDeleteNotification } =
		useDeleteNotificationMutation()

	const { deleteAllNotifications, isLoadingDeleteAllNotifications } =
		useDeleteAllNotificationsMutation()

	const { t } = useTranslations()
	const { user } = useProfile()

	const isNotificationsUnread = notifications?.some(
		notification => !notification.isRead
	)

	const handleNotificationClick = (notificationId: string, redirectUrl: string) => {
		markNotificationAsRead(notificationId)
		router.push(redirectUrl)
	}

	if (isLoadingNotifications) {
		return (
			<div className='flex justify-center items-center w-full max-w-[400px]'>
				<Loading />
			</div>
		)
	}

	if (!notifications || notifications.length === 0) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>{t('notifications')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col gap-3 justify-center items-center w-full max-w-[400px]'>
						<Card className='w-full'>
							<CardContent>
								<div className='text-center text-muted-foreground py-8'>
									<Bell className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
									<p>{t('noNotificationsYet')}</p>
									<p className='text-sm'>
										{t('youWillSeeNotificationsHereWhenTheyArrive')}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					{t('notifications')}
					<div className='flex gap-2'>
						{isNotificationsUnread && (
							<Button
								onClick={() => markAllNotificationsAsRead()}
								disabled={isLoadingMarkAllNotificationsAsRead}
								className='flex items-center gap-1'
							>
								<Eye className='size-4' />
								{t('readAll')}
							</Button>
						)}
						<Button
							variant='destructive'
							onClick={() => deleteAllNotifications()}
							disabled={isLoadingDeleteAllNotifications}
							className='flex items-center gap-1'
						>
							<Trash className='size-4' />
							{t('deleteAll')}
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className=''>
					<ul>
						{notifications.map(notification => (
							<li
								className='flex w-full items-center gap-2 font-medium border px-1 border-ring/20 py-2 bg-primary/10 my-1 hover:bg-accent rounded-xl cursor-pointer'
								key={notification.id}
							>
								<div
									className={cn(
										'block w-2 h-10 rounded-full',
										notification.isRead
											? 'bg-transparent border border-primary'
											: 'bg-primary'
									)}
								></div>
								<div className='flex-1 space-y-1'>
									<div className=' flex flex-1 items-center justify-between gap-2 '>
										<h3 className='text-base'>
											{t(notification.title)}
										</h3>
										<p className='text-xs bg-primary px-2 py-0.5 rounded-full text-primary-foreground'>
											{notification.type ===
											'DEBT_SETTLED'
												? t('debt')
												: notification.type ===
												  'FRIEND_REQUEST'
												? t('friend')
												: notification.type ===
												  'GROUP_INVITATION'
												? t('group')
												: notification.type ===
												  'EXPENSE_ADDED'
												? t('expense')
												: notification.type ===
												  'DEBT_CREATED'
												? t('debt')
												: notification.type ===
												  'USER_REMOVED_FROM_GROUP'
												? t('groupLeft')
												: ''}
										</p>
									</div>
									<p
										className={cn(
											'text-xs text-muted-foreground',
											notification.type ===
												'DEBT_CREATED' &&
												notification.metadata
													?.isDebtor === false &&
												'text-green-500/90',
											notification.type ===
												'DEBT_CREATED' &&
												notification.metadata
													?.isDebtor === true &&
												'text-red-500/90',
											notification.type ===
												'DEBT_SETTLED' &&
												'text-green-500/90'
										)}
									>
										{replaceMessagePlaceholders(
											t(notification.message),
											notification.metadata
										)}
									</p>
									<div className='text-xs flex items-center justify-between gap-1  '>
										<div className=' text-muted-foreground flex items-center gap-2'>
											<div className='flex items-center   px-2 py-1 rounded-full gap-1 bg-primary/10'>
												<Clock className='size-3' />
												{formatDate(notification.createdAt, 'dd.MM.yyyy', user?.language || Language.EN)}
											</div>
											<div
												className='flex items-center  gap-1 bg-bad-red px-1 py-1 rounded-full text-background cursor-pointer'
												onClick={() =>
													deleteNotification(
														notification.id
													)
												}
											>
												<Trash className='size-3' />
											</div>
										</div>
										<div className=''>
											{notification.type ===
												'EXPENSE_ADDED' && (
												<button
													onClick={() => handleNotificationClick(notification.id, `/expenses/${notification.relatedExpenseId}`)}
													className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary cursor-pointer'
												>
													{t('show')}{' '}
													<Link2 className='size-4 text-primary' />
												</button>
											)}
											{notification.type ===
												'DEBT_CREATED' && (
												<button
													onClick={() => handleNotificationClick(notification.id, `/expenses/${notification.relatedExpenseId}`)}
													className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary cursor-pointer'
												>
													{t('show')}{' '}
													<Link2 className='size-4 text-primary' />
												</button>
											)}
											{notification.type ===
												'GROUP_INVITATION' && (
												<button
													onClick={() => handleNotificationClick(notification.id, `/groups/${notification.relatedGroupId}`)}
													className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary cursor-pointer'
												>
													{t('show')}{' '}
													<Link2 className='size-4 text-primary' />
												</button>
											)}
											{notification.type ===
												'DEBT_SETTLED' && (
												<button
													onClick={() => handleNotificationClick(notification.id, `/groups/${notification.relatedGroupId}`)}
													className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary cursor-pointer'
												>
													{t('show')}{' '}
													<Link2 className='size-4 text-primary' />
												</button>
											)}
											{notification.type ===
												'FRIEND_REQUEST' && (
												<button
													onClick={() => handleNotificationClick(notification.id, `/dashboard/settings/friends`)}
													className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary cursor-pointer'
												>
													{t('show')}{' '}
													<Link2 className='size-4 text-primary' />
												</button>
											)}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}

export default NotificationsData
