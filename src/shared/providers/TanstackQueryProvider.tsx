'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { authService } from '../services'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { usePathname } from 'next/navigation'

export function TanstackQueryProvider({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const pathname = usePathname()

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

		// Глобальна обробка помилок
		queryClient.getQueryCache().subscribe((event) => {
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
							toast.error('Please login again')
						}
					}
				}
			}
		})

		return queryClient
	}
	)
	return (
		<QueryClientProvider client={client}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}
