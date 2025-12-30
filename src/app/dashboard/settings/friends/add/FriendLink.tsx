'use client'
import React from 'react'
import { Button } from '@/shared/componets/ui'
import { useProfile, useTranslations } from '@/shared/hooks'
import Link from 'next/link'
import { toast } from 'sonner'

type Props = {}

export const FriendLink = (props: Props) => {
    const {user} = useProfile()
    const { t } = useTranslations()
    
    if(!user) return null
    const qrCodeValue = `${process.env.FRONTEND_URL}/dashboard/settings/friends/add/${user.id}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(qrCodeValue)
        toast.success(t('linkCopiedToClipboard'))
    }
	return (
		<div className='flex flex-col w-full'>
			<h3 className='font-semibold mb-2'>{t('yourUserLink')}</h3>
			<Link href={qrCodeValue} className='text-base block break-all break-words mb-2'>{qrCodeValue}</Link>
			<Button className='w-full' onClick={handleCopyLink}>{t('copyLink')}</Button>
		</div>
	)
}
