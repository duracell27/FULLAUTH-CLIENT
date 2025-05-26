import React from 'react'

import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import Link from 'next/link'
import SettingsForm from './SettingsForm'

export const metadata: Metadata = {
	title: 'Profile settings'
}

const SettingsPage = () => {
	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<SettingsForm />

			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>More settings</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						<li className=''>
							<Link
								className='border-t border-b border-ring/20 py-2 hover:bg-accent block'
								href='/friends'
							>
								Friends
							</Link>
						</li>
						<li className=''>
							<Link
								className=' border-b border-ring/20 py-2 hover:bg-accent block'
								href='/theme'
							>
								Theme
							</Link>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}

export default SettingsPage
