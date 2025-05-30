'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { authService } from '../services'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function TanstackQueryProvider({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
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

					// 401 помилка
					if (error?.statusCode === 401) {
						authService.logout()
						router.push('/auth/login')
						
					} else {
						console.log('Глобальна помилка запиту:', error)
						toast('Глобальна помилка запиту')
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
