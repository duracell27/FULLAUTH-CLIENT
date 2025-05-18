'use client'
import Link from 'next/link'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	Toaster
} from '../componets/ui'
import { useProfile } from '../hooks'

export function HeaderProvider() {
	const { user } = useProfile()

	if (!user) return null
	return (
		<div>
			<Card className='w-full max-w-[400px] flex justify-between items-center my-2 py-1 px-2'>
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
