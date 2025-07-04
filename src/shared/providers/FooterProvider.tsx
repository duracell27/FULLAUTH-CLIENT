'use client'
import Link from 'next/link'
import { Card } from '../componets/ui'

import { usePathname } from 'next/navigation'
import { Separator } from '../componets/ui/Separator'

export function FooterProvider() {
	
	const pathname = usePathname()
	const excludedPaths = ['/', '/auth/login', '/auth/register']

	if (excludedPaths.includes(pathname)) {
		return null
	}

	return (
		<div className='fixed bottom-0 left-0 right-0  overflow-hidden rounded-t-md shadow-lg z-10'>
			<Card className='w-[92%] max-w-[400px] mx-auto flex justify-between items-center mb-2 py-1 px-1 border-t border-gray-200 '>
				<div className='flex gap-2 items-center w-full '>
					<Link
						className={
							pathname.includes('/summary')
								? 'bg-muted-foreground/10 py-2 px-5 font-bold rounded-md flex-1 text-center'
								: 'bg-background py-2 px-5 rounded-md flex-1 text-center'
						}
						href={'/summary'}
					>
						Summary
					</Link>
					<Separator className='h-8' orientation='vertical' />
					<Link
						className={
							pathname.includes('/groups')
								? 'bg-muted-foreground/10 py-2 px-5 font-bold rounded-md flex-1 text-center'
								: 'bg-background py-2 px-5 rounded-md flex-1 text-center'
						}
						href={'/groups'}
					>
						Groups
					</Link>
				</div>
			</Card>
		</div>
	)
}
