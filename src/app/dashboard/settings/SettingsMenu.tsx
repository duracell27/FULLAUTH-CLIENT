'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import Link from 'next/link'
import { useTranslations, useProfile } from '@/shared/hooks'
import { UserRole } from '@/shared/types'
import { BookOpen, CreditCard, Globe, LayoutDashboard, Palette, Users } from 'lucide-react'

export function SettingsMenu() {
	const { t } = useTranslations()
	const { user } = useProfile()

	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<CardTitle>{t('moreSettings')}</CardTitle>
			</CardHeader>
			<CardContent>
				<ul>
					<li>
						<Link
							className='border-t border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
							href='/dashboard/settings/friends'
						>
							<Users className='size-4 text-muted-foreground' />
							{t('friends')}
						</Link>
					</li>
					<li>
						<Link
							className='border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
							href='/theme'
						>
							<Palette className='size-4 text-muted-foreground' />
							{t('theme')}
						</Link>
					</li>
					<li>
						<Link
							className='border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
							href='/language'
						>
							<Globe className='size-4 text-muted-foreground' />
							{t('language')}
						</Link>
					</li>
					<li>
						<Link
							className='border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
							href='/dashboard/card-requests'
						>
							<CreditCard className='size-4 text-muted-foreground' />
							{t('bankCard')}
						</Link>
					</li>
					<li>
						<Link
							className='border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
							href='/guide'
						>
							<BookOpen className='size-4 text-muted-foreground' />
							{t('guide')}
						</Link>
					</li>
					{user?.role === UserRole.Admin && (
						<li>
							<Link
								className='border-b border-ring/20 py-2 hover:bg-accent flex items-center gap-2'
								href='/dashboard/admin'
							>
								<LayoutDashboard className='size-4 text-muted-foreground' />
								Адмін панель
							</Link>
						</li>
					)}
				</ul>
			</CardContent>
		</Card>
	)
}
