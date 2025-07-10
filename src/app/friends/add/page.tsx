import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'

import React from 'react'
import { QRCodeCard } from './QRCode'
import { FriendLink } from './FriendLink'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Add friend'
}

type Props = {}

const AddFriendPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full'>
			<div className='flex justify-between items-center w-full'>
				<BackButton />
			</div>
            <Card className='w-full max-w-[400px]'>
                <CardHeader>
                    <CardTitle>Add friend</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-base'>Scan QR code or copy friend link</p>
                </CardContent>
            </Card>

            <QRCodeCard />
            <FriendLink />
		</div>
	)
}

export default AddFriendPage
