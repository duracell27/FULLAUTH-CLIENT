'use client'
import {
	buttonVariants,
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/shared/componets/ui'
import { useTranslationsHome } from '@/shared/hooks/useTranslationsHome'
import { LanguageSwitcher } from '@/shared/componets/LanguageSwitcher'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/shared/utils'

export function HomeClient() {
	const { t } = useTranslationsHome()

	return (
		<div className='flex flex-col items-center justify-center h-full mb-18 pt-18 space-y-3'>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<h1 className='text-2xl font-bold text-center'>
						{t('welcomeToLendower')}
					</h1>
				</CardHeader>
				<CardContent>
					<Image
						className='rounded-lg my-2'
						src='/images/home.jpg'
						alt='bannerImg'
						width={1000}
						height={500}
						priority
					/>
					<p className='text-sm text-center'>
						{t('easilyTrackSharedExpensesAndBalances')}
					</p>
				</CardContent>
				<CardFooter className='flex flex-col items-center gap-4'>
					<div className='flex justify-center gap-3'>
						<Link
							href='/auth/login'
							className={buttonVariants()}
						>
							{t('login')}
						</Link>
						<Link
							href='/auth/register'
							className={buttonVariants()}
						>
							{t('register')}
						</Link>
					</div>
				</CardFooter>
			</Card>
			<Card className='w-full max-w-[400px]'>
				<CardContent className='p-0'>
					<Link
						href='/guide'
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'text-xs text-primary hover:opacity-100 transition-opacity w-full'
						)}
					>
						{t('guide')}
					</Link>
				</CardContent>
			</Card>
			<Card className='w-full pt-3 max-w-[400px]'>
				<CardContent>
					<div className='flex justify-center gap-3'>
						<Link
							href='/version'
							className={cn(
								buttonVariants(),
								'text-sm text-center'
							)}
						>
							v.0.3.5
						</Link>
						<Link
							href='/contact'
							className={cn(
								buttonVariants(),
								'text-sm text-center'
							)}
						>
							{t('contact')}
						</Link>
						<LanguageSwitcher />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
