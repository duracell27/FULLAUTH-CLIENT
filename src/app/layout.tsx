import type { Metadata } from 'next'
import { MainProvider } from '@/shared/providers'
import { Outfit } from "next/font/google";
import '@/shared/styles/globals.css'

export const metadata: Metadata = {
	title: {
		absolute: 'Lendower',
		template: '%s | Lendower'
	},
	description:
		'Lendower — a handy app for calculating debts from shared trips, cafe visits, or group expenses. Easily track who owes whom!'
}

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning className={outfit.variable}>
			<body >
				<div
					className='flex min-h-screen w-full justify-center bg-cover'
					style={{ backgroundImage: "url('/images/bg6.png')" }}
				>
					<div className='w-full mx-2 max-w-[400px] relative'>
						<MainProvider>{children}</MainProvider>
					</div>
				</div>
			</body>
		</html>
	)
}
