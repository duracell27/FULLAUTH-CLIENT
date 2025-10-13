'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { QRCodeCard } from './QRCode'
import { FriendLink } from './FriendLink'
import { useTranslations } from '@/shared/hooks'

type Props = {}

export const AddFriendPageClient = (props: Props) => {
	const { t } = useTranslations()
	
	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full'>
			<div className='flex justify-between items-center w-full'>
				<BackButton />
			</div>
            <Card className='w-full max-w-[400px]'>
                <CardHeader>
                    <CardTitle>{t('addFriend')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-base'>{t('scanQRCodeOrCopyLink')}</p>
                </CardContent>
            </Card>

            <QRCodeCard />
            <FriendLink />
		</div>
	)
}
