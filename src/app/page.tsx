import {
	buttonVariants,
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/shared/componets/ui'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<Card>
				<CardHeader>
					<h1 className='text-2xl font-bold text-center'>
						Welcome to Lendower
					</h1>
				</CardHeader>
				<CardContent>
					<Image
					className='rounded-lg my-2'
						src='/images/home.jpg'
						alt='bannerImg'
						layout='responsive'
						width={1000}
						height={500}
					/>
					<p className='text-sm text-center'>
						Easily track shared expenses and balances! Split costs
						with any group—friends, family, housemates, or travel
						buddies.
					</p>
				</CardContent>
				<CardFooter className='flex justify-center gap-3'>
					<Link href='/auth/login' className={buttonVariants()}>
						Login
					</Link>
					<Link href='/auth/register' className={buttonVariants()}>
						Register
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
