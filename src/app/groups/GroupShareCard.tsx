'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { Copy, Check } from 'lucide-react'
import { useTranslations } from '@/shared/hooks'

type Props = {
	groupId: string
}

export const GroupShareCard = ({ groupId }: Props) => {
	const { t } = useTranslations()
	const [copied, setCopied] = useState(false)

	const groupUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://lendower.com'}/groups/${groupId}/public`

	const handleCopy = () => {
		navigator.clipboard.writeText(groupUrl)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Card className='w-full max-w-[400px]'>
			<CardContent className='flex items-center gap-4 py-3'>
				<div className='bg-white p-2 rounded-lg flex-shrink-0'>
					<QRCode value={groupUrl} size={80} />
				</div>
				<div className='flex flex-col gap-2 flex-1'>
					<span className='text-sm font-bold'>{t('shareGroup')}</span>
					<Button
						size='sm'
						className='w-full'
						onClick={handleCopy}
					>
						{copied ? (
							<>
								<Check className='size-4 text-good-green' />
								{t('linkCopiedToClipboard')}
							</>
						) : (
							<>
								<Copy className='size-4' />
								{t('copyLink')}
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
