'use client'
import React from 'react'
import { useAdminDashboard } from '@/shared/hooks/useAdminDashboard'
import { useProfile } from '@/shared/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { FaUsers, FaMoneyBillWave, FaLayerGroup } from 'react-icons/fa'
import { UserRole } from '@/shared/types'
import { useRouter } from 'next/navigation'

export const AdminDashboard = () => {
	const { dashboard, isLoading, error } = useAdminDashboard()
	const { user, isLoadingProfile } = useProfile()
	const router = useRouter()

	React.useEffect(() => {
		if (!isLoadingProfile && user && user.role !== UserRole.Admin) {
			router.push('/groups')
		}
	}, [user, isLoadingProfile, router])

	if (isLoadingProfile || isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-lg'>Завантаження...</div>
			</div>
		)
	}

	if (!user || user.role !== UserRole.Admin) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-lg text-red-500'>
					У вас немає доступу до цієї сторінки
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-lg text-red-500'>
					Помилка завантаження даних
				</div>
			</div>
		)
	}

	if (!dashboard) {
		return null
	}

	const getExpenseTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			EQUAL: 'Рівномірно',
			CUSTOM: 'Власний розподіл',
			PERCENTAGE: 'За відсотками',
			SHARES: 'За частками',
			EXTRA: 'Додатково'
		}
		return labels[type] || type
	}

	return (
		<div className='flex flex-col gap-6 justify-center items-center pb-18 pt-18 w-full max-w-[400px] px-2'>
			<h1 className='text-2xl font-bold w-full text-center'>
				Адмін панель
			</h1>

			{/* Основна статистика */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Користувачів
						</CardTitle>
						<FaUsers className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{dashboard.users.total}</div>
						<p className='text-xs text-muted-foreground'>
							Зареєстровано в системі
						</p>
						<p className='text-xs text-green-600 mt-1'>
							{dashboard.users.active} активних за 30 днів
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Витрат</CardTitle>
						<FaMoneyBillWave className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{dashboard.expenses.total}
						</div>
						<p className='text-xs text-muted-foreground'>
							Створено витрат
						</p>
						<p className='text-xs text-green-600 mt-1'>
							{dashboard.expenses.lastMonth} за останній місяць
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Груп</CardTitle>
						<FaLayerGroup className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{dashboard.groups.total}</div>
						<p className='text-xs text-muted-foreground'>
							Всього груп
						</p>
						<p className='text-xs text-green-600 mt-1'>
							{dashboard.groups.active} активних / {dashboard.groups.finished}{' '}
							завершених
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Статистика типів витрат */}
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Статистика типів витрат</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{dashboard.expenseTypeStatistics.map(stat => (
							<div key={stat.type} className='space-y-2'>
								<div className='flex items-center justify-between text-sm'>
									<span className='font-medium'>
										{getExpenseTypeLabel(stat.type)}
									</span>
									<span className='text-muted-foreground'>
										{stat.count} ({stat.percentage}%)
									</span>
								</div>
								<div className='w-full bg-secondary rounded-full h-2.5'>
									<div
										className='bg-primary h-2.5 rounded-full transition-all duration-300'
										style={{ width: `${stat.percentage}%` }}
									/>
								</div>
							</div>
						))}
					</div>
					<div className='mt-4 pt-4 border-t'>
						<div className='flex items-center justify-between text-sm font-medium'>
							<span>Всього витрат:</span>
							<span>{dashboard.expenses.total}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Додаткова інформація */}
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Середні показники</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground'>
							Витрат на користувача:
						</span>
						<span className='text-sm font-medium'>
							{dashboard.users.total > 0
								? (
										dashboard.expenses.total / dashboard.users.total
									).toFixed(2)
								: 0}
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground'>
							Витрат на групу:
						</span>
						<span className='text-sm font-medium'>
							{dashboard.groups.total > 0
								? (
										dashboard.expenses.total / dashboard.groups.total
									).toFixed(2)
								: 0}
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground'>
							Користувачів на групу:
						</span>
						<span className='text-sm font-medium'>
							{dashboard.groups.total > 0
								? (dashboard.users.total / dashboard.groups.total).toFixed(
										2
									)
								: 0}
						</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-muted-foreground'>
							Активність користувачів:
						</span>
						<span className='text-sm font-medium'>
							{dashboard.users.total > 0
								? (
										(dashboard.users.active / dashboard.users.total) *
										100
									).toFixed(1)
								: 0}
							%
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
