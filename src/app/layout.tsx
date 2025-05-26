import type { Metadata } from 'next'
import { MainProvider } from '@/shared/providers'
import '@/shared/styles/globals.css'
import { ToggleTheme } from '@/shared/componets/ui'

export const metadata: Metadata = {
	title: {
		absolute: 'Lendower',
		template: '%s | Lendower'
	},
	description:
		'Lendower — a handy app for calculating debts from shared trips, cafe visits, or group expenses. Easily track who owes whom!'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
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
