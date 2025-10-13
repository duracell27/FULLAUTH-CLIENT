'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import Link from 'next/link'
import { useTranslations } from '@/shared/hooks'

export function SettingsMenu() {
	const { t } = useTranslations()
	
	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<CardTitle>{t('moreSettings')}</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					<li className=''>
						<Link
							className='border-t border-b border-ring/20 py-2 hover:bg-accent block'
							href='/dashboard/settings/friends'
						>
							{t('friends')}
						</Link>
					</li>
					<li className=''>
						<Link
							className=' border-b border-ring/20 py-2 hover:bg-accent block'
							href='/theme'
						>
							{t('theme')}
						</Link>
					</li>

					<li className=''>
						<Link
							className=' border-b border-ring/20 py-2 hover:bg-accent block'
							href='/language'
						>
							{t('language')}
						</Link>
					</li>
				</ul>
			</CardContent>
		</Card>
	)
}
