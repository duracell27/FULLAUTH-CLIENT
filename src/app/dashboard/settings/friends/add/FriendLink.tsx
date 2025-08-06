'use client'
import React from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { useProfile } from '@/shared/hooks'
import Link from 'next/link'
import { toast } from 'sonner'

type Props = {}

export const FriendLink = (props: Props) => {
    const {user} = useProfile()
    if(!user) return null
    const qrCodeValue = `${process.env.FRONTEND_URL}/dashboard/settings/friends/add/${user.id}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrCodeValue)
        toast.success('Link copied to clipboard')
    }
	return (
		<div className='flex flex-col justify-center items-center w-full'>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>Your user link</CardTitle>
				</CardHeader>
				<CardContent>
					<Link href={qrCodeValue} className='text-base block break-all break-words'>{qrCodeValue}</Link>
                    <Button className='my-2' onClick={handleCopyLink}>Copy link</Button>
				</CardContent>
			</Card>
		</div>
	)
}
