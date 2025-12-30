'use client'
import Link from 'next/link'
import { Card } from '../componets/ui'

import { usePathname } from 'next/navigation'
import { Separator } from '../componets/ui/Separator'
import { useTranslations } from '../hooks'

export function FooterProvider() {
	const { t } = useTranslations()
	const pathname = usePathname()
	const excludedPaths = ['/', '/auth/login', '/auth/register']

	if (excludedPaths.includes(pathname)) {
		return null
	}

	return (
		<div className='fixed bottom-0 left-0 w-full flex justify-center px-2 z-10'>
			<Card className='w-full max-w-[400px] flex justify-between items-center mb-2 py-1 px-1 border-t border-gray-200'>
				<div className='flex gap-2 items-center w-full '>
					<Link
						className={
							pathname.includes('/summary')
								? 'bg-muted-foreground/10 py-2 px-5 font-bold rounded-md flex-1 text-center'
								: 'bg-background py-2 px-5 rounded-md flex-1 text-center'
						}
						href={'/summary'}
					>
						{t('summary')}
					</Link>
					<Separator className='h-8' orientation='vertical' />
					<Link
						className={
							pathname.includes('/friends')
								? 'bg-muted-foreground/10 py-2 px-5 font-bold rounded-md flex-1 text-center'
								: 'bg-background py-2 px-5 rounded-md flex-1 text-center'
						}
						href={'/friends'}
					>
						{t('friends')}
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
						{t('groups')}
					</Link>
				</div>
			</Card>
		</div>
	)
}
