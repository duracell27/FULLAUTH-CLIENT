import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'

import { Metadata } from 'next'
import NotificationsData from './NotificationsData'

export const metadata: Metadata = {
	title: 'Notifications'
}

type Props = {}

const NotificationsPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center py-18 w-full max-w-[400px]'>
			<div className='flex justify-between items-center w-full'>
				<NotificationsData />
			</div>
		</div>
	)
}

export default NotificationsPage
