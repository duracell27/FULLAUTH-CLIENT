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
				<MainProvider>
					<div className='relative flex min-h-screen flex-col'>
            <ToggleTheme/>
						<div className='flex h-screen w-full items-center justify-center px-4'>
							{children}
						</div>
					</div>
				</MainProvider>
			</body>
		</html>
	)
}
