'use client'
import Link from 'next/link'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	Badge
} from '../componets/ui'
import { useProfile } from '../hooks'

import { usePathname } from 'next/navigation'
import { useNotificationsUnread } from '../hooks/useNotificationsUnread'
import { Bell } from 'lucide-react'

export function HeaderProvider() {
	const { user } = useProfile()
	const { notificationsUnread, isLoadingNotificationsUnread } =
		useNotificationsUnread()
	const pathname = usePathname()
	const excludedPaths = ['/', '/auth/login', '/auth/register']

	if (excludedPaths.includes(pathname) || !user) {
		return null
	}

	const notificationCount = notificationsUnread?.length || 0

	return (
		<div className='fixed top-0 left-0 w-full flex justify-center px-2 z-10' style={{ transform: 'translateZ(0)' }}>
			<Card className='w-full max-w-[400px] flex justify-between items-center my-2 py-1 px-2'>
				<h1 className='font-bold'>
					<Link href={process.env.NEXT_PUBLIC_FRONTEND_URL as string}>
						Lendower
					</Link>
				</h1>
				<div className='flex items-center gap-5'>
					<Link href={'/notifications'} className='relative mt-2'>
						<Bell className='w-5 h-5' />
						<Badge
							variant={
								notificationCount > 0
									? 'destructive'
									: 'secondary'
							}
							className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs'
						>
							{notificationCount > 99 ? '99+' : notificationCount}
						</Badge>
					</Link>
					<Link href={'/dashboard/settings'}>
						<Avatar>
							<AvatarImage src={user.picture} />
							<AvatarFallback>
								{user.displayName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Link>
				</div>
			</Card>
		</div>
	)
}
