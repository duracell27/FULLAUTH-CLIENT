'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { QRCodeCard } from './QRCode'
import { FriendLink } from './FriendLink'
import { SearchFriend } from './SearchFriend'
import { useTranslations } from '@/shared/hooks'

type Props = {}

export const AddFriendPageClient = (props: Props) => {
	const { t } = useTranslations()

	return (
		<div className='flex flex-col gap-3 justify-center items-center py-18 w-full max-w-[400px]'>
			<div className='flex justify-between items-center w-full'>
				<BackButton />
			</div>

			<SearchFriend />

            <Card className='w-full max-w-[400px]'>
                <CardHeader>
                    <CardTitle>{t('addFriend')}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <p className='text-base'>{t('scanQRCodeOrCopyLink')}</p>
                    <div>
                        <h3 className='font-semibold mb-2'>{t('yourQRCode')}</h3>
                        <QRCodeCard />
                    </div>
                    <FriendLink />
                </CardContent>
            </Card>
		</div>
	)
}
