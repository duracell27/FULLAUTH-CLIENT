'use client'

import { HeaderProvider } from './HeaderProvider'
import { FooterProvider } from './FooterProvider'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'

export function MainProvider({ children }: { children: React.ReactNode }) {
	return (
		<TanstackQueryProvider>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				disableTransitionOnChange
			>
				<HeaderProvider />
				<ToastProvider />
				{children}
				<FooterProvider />
			</ThemeProvider>
		</TanstackQueryProvider>
	)
}
