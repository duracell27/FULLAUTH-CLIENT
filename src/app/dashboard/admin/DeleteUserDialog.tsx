'use client'
import React, { useState } from 'react'
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle
} from '@/shared/componets/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService, RecentUser } from '@/shared/services/admin.service'
import { toast } from 'sonner'
import { toastMessageHandler } from '@/shared/utils'
import { FaLayerGroup, FaMoneyBillWave } from 'react-icons/fa'
import { HandCoins, Trash, Receipt, CreditCard } from 'lucide-react'

type Props = {
	user: RecentUser
}

export const DeleteUserDialog = ({ user }: Props) => {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ['admin-user-stats', user.id],
		queryFn: () => adminService.getUserDeleteDetails(user.id),
		enabled: open,
		staleTime: 0
	})

	const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
		mutationFn: () => adminService.deleteUser(user.id),
		onSuccess: () => {
			toast.success('Користувача видалено')
			queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
			setOpen(false)
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	const hasLinkedData = stats
		? stats.groupsCount > 0 ||
		  stats.expensesCreatedCount > 0 ||
		  stats.expensesAsPayerCount > 0 ||
		  stats.debtsCount > 0 ||
		  stats.paymentsCount > 0
		: false

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button
				size='xs'
				className='bg-bad-red hover:bg-bad-red/80 shrink-0'
				onClick={() => setOpen(true)}
			>
				<Trash className='size-3' />
			</Button>
			<DialogContent className='w-[90vw] max-w-sm rounded-md'>
				<DialogTitle>Видалення користувача</DialogTitle>

				{isLoadingStats ? (
					<p className='text-sm text-muted-foreground'>Завантаження даних...</p>
				) : hasLinkedData ? (
					/* Видалення заборонено — є пов'язані дані */
					<div className='flex flex-col gap-4'>
						<p className='text-sm'>
							Неможливо видалити користувача{' '}
							<span className='font-semibold'>{user.displayName}</span>{' '}
							<span className='text-muted-foreground'>({user.email})</span> — він залучений у:
						</p>
						<div className='rounded-lg border divide-y'>
							{stats!.groupsCount > 0 && (
								<div className='flex items-center justify-between px-4 py-3'>
									<div className='flex items-center gap-2 text-sm'>
										<FaLayerGroup className='size-4 text-muted-foreground' />
										<span>Груп</span>
									</div>
									<span className='font-semibold'>{stats!.groupsCount}</span>
								</div>
							)}
							{stats!.expensesCreatedCount > 0 && (
								<div className='flex items-center justify-between px-4 py-3'>
									<div className='flex items-center gap-2 text-sm'>
										<FaMoneyBillWave className='size-4 text-muted-foreground' />
										<span>Витрат створено</span>
									</div>
									<span className='font-semibold'>{stats!.expensesCreatedCount}</span>
								</div>
							)}
							{stats!.expensesAsPayerCount > 0 && (
								<div className='flex items-center justify-between px-4 py-3'>
									<div className='flex items-center gap-2 text-sm'>
										<Receipt className='size-4 text-muted-foreground' />
										<span>Витрат як платник</span>
									</div>
									<span className='font-semibold'>{stats!.expensesAsPayerCount}</span>
								</div>
							)}
							{stats!.debtsCount > 0 && (
								<div className='flex items-center justify-between px-4 py-3'>
									<div className='flex items-center gap-2 text-sm'>
										<CreditCard className='size-4 text-muted-foreground' />
										<span>Боргів</span>
									</div>
									<span className='font-semibold'>{stats!.debtsCount}</span>
								</div>
							)}
							{stats!.paymentsCount > 0 && (
								<div className='flex items-center justify-between px-4 py-3'>
									<div className='flex items-center gap-2 text-sm'>
										<HandCoins className='size-4 text-muted-foreground' />
										<span>Платежів</span>
									</div>
									<span className='font-semibold'>{stats!.paymentsCount}</span>
								</div>
							)}
						</div>
						<Button onClick={() => setOpen(false)}>Зрозуміло</Button>
					</div>
				) : (
					/* Можна видаляти — всі лічильники = 0 */
					<div className='flex flex-col gap-4'>
						<p className='text-sm'>
							Ви впевнені що хочете видалити користувача{' '}
							<span className='font-semibold'>{user.displayName}</span>?{' '}
							<span className='text-muted-foreground'>({user.email})</span>
						</p>
						<p className='text-xs text-muted-foreground'>
							Цю дію неможливо скасувати.
						</p>
						<div className='flex gap-2'>
							<Button
								variant='outline'
								className='flex-1'
								onClick={() => setOpen(false)}
								disabled={isDeletingUser}
							>
								Скасувати
							</Button>
							<Button
								className='flex-1 bg-bad-red hover:bg-bad-red/80'
								onClick={() => deleteUser()}
								disabled={isDeletingUser}
							>
								{isDeletingUser ? 'Видалення...' : 'Видалити'}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
