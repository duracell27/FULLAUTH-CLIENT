'use client'
import { Loading } from '@/shared/componets/ui/Loading'
import { useProfile } from '@/shared/hooks'
import React from 'react'
import QRCode from 'react-qr-code'

type Props = {}

export const QRCodeCard = (props: Props) => {
	const { user, isLoadingProfile } = useProfile()
	
	// if (!user) return null
	let qrCodeValue=''
	if (!isLoadingProfile) {
		if (user) {
			qrCodeValue = `${process.env.FRONTEND_URL}/dashboard/settings/friends/add/${user.id}`
		}
	}

	return (
		<div className='flex justify-center items-center w-full'>
			{isLoadingProfile ? (
				<Loading />
			) : (
				<QRCode value={qrCodeValue} size={256} />
			)}
		</div>
	)
}
