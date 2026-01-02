'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { cookieUtils } from '../utils/cookie'
import { Language } from '../types'

// Мапінг мов на ISO коди
const languageToLocale: Record<Language, string> = {
	EN: 'en',
	UK: 'uk',
	DE: 'de',
	ES: 'es',
	FR: 'fr',
	CS: 'cs',
	PL: 'pl',
	TR: 'tr',
	HI: 'hi',
	ZH: 'zh'
}

export function TanstackQueryProvider({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const pathname = usePathname()
	const [translations, setTranslations] = useState<Record<string, string>>({})

	const [client] = useState(
		() => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false,
					staleTime: 1000 * 60 * 1,
					gcTime: 1000 * 60,
					retry: 1
				},
			},
		})

		return queryClient
	}
	)

	// Завантаження перекладів
	useEffect(() => {
		const loadTranslations = async () => {
			const currentLanguage = cookieUtils.getLanguage()
			const locale = languageToLocale[currentLanguage]

			try {
				const messagesModule = await import(`../../locales/${locale}/settings.json`)
				const messages = messagesModule.default || messagesModule
				setTranslations(messages)
			} catch (error) {
				console.error('Failed to load translations:', error)
				// Fallback to English
				try {
					const fallbackMessages = await import(`../../locales/en/settings.json`)
					const messages = fallbackMessages.default || fallbackMessages
					setTranslations(messages)
				} catch (fallbackError) {
					console.error('Failed to load fallback translations:', fallbackError)
				}
			}
		}

		loadTranslations()
	}, [])

	// Функція для отримання перекладу
	const t = useCallback((key: string): string => {
		return translations[key] || key
	}, [translations])

	useEffect(() => {
		// Глобальна обробка помилок
		const unsubscribe = client.getQueryCache().subscribe((event) => {
			if (event?.type === 'updated') {
				const query = event.query
				const state = query.state

				if (state.status === 'error') {
					const error = state.error as any

					// 401 помилка - не викидаємо на логін якщо користувач на сторінках auth
					if (error?.statusCode === 401 && pathname !== '/') {
						// Перевіряємо чи користувач не знаходиться на сторінках auth
						const isAuthPage = pathname.startsWith('/auth/')

						if (!isAuthPage) {
							authService.logout()
							router.push('/auth/login')
							toast.error(t('pleaseLoginAgain'), {
							action: {
								label: t('login'),
								onClick: () => router.push('/auth/login')
							}
						})
						}
					}
				}
			}
		})

		return () => {
			unsubscribe()
		}
	}, [client, pathname, router, t])

	return (
		<QueryClientProvider client={client}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}
