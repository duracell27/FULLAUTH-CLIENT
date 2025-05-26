'use client'
import Link from 'next/link'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
} from '../componets/ui'
import { useProfile } from '../hooks'

import { usePathname } from 'next/navigation'

export function HeaderProvider() {
	const { user } = useProfile()
	const pathname = usePathname()
	const excludedPaths = ['/', '/auth/login', '/auth/register']

	if (excludedPaths.includes(pathname) || !user) {
		return null
	}

	return (
		<div className='fixed top-0 left-0 right-0 w-full overflow-hidden rounded-t-md z-10'>
			<Card className='w-[92%] max-w-[400px] mx-auto flex justify-between items-center my-2 py-1 px-2'>
				<h1 className='font-bold'>
					<Link href={process.env.NEXT_PUBLIC_FRONTEND_URL as string}>
						Lendower
					</Link>
				</h1>
				<div className=''>
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
