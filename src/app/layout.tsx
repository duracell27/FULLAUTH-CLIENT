import type { Metadata } from 'next'
import { MainProvider } from '@/shared/providers'
import { Outfit } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { headers } from 'next/headers'
import { cookieUtils } from '@/shared/utils/cookie'
import { siteMetadata } from '@/shared/constants/metadata'
import { Language } from '@/shared/types'
import '@/shared/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
	const headersList = await headers()
	const cookieHeader = headersList.get('cookie')
	const language = cookieUtils.getLanguageFromCookie(cookieHeader || undefined)

	const metadata = siteMetadata[language] || siteMetadata[Language.EN]

	return {
		title: {
			absolute: metadata.title,
			template: `%s | ${metadata.title}`
		},
		description: metadata.description,
		alternates: {
			languages: {
				'en': 'https://lendower.com',
				'uk': 'https://lendower.com',
				'de': 'https://lendower.com',
				'es': 'https://lendower.com',
				'fr': 'https://lendower.com',
				'cs': 'https://lendower.com',
				'pl': 'https://lendower.com',
				'tr': 'https://lendower.com',
				'hi': 'https://lendower.com',
				'zh': 'https://lendower.com'
			}
		}
	}
}

const outfit = Outfit({
	subsets: ['latin'],
	variable: '--font-sans'
})

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning className={outfit.variable}>
			<head>
				{/* Google Ads */}
				<script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3510558221335749'
					crossOrigin='anonymous'
				></script>
			</head>
			<body
				className='bg-cover bg-fixed'
				style={{ backgroundImage: "url('/images/bg6.png')" }}
			>
				<div className='flex min-h-screen w-full justify-center'>
					<div className='w-full mx-2 max-w-[400px] relative'>
						<MainProvider>{children}</MainProvider>
					</div>
				</div>
				{/* Google Analytics */}
				{process.env.GOOGLE_ANALYTICS && (
					<GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS} />
				)}
			</body>
		</html>
	)
}
