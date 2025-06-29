'use client'
import React from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type Props = {
	url?: string
}

export const BackButton = (props: Props) => {
	const router = useRouter()

	const { url } = props

	const handleBackClick = () => {
		if (url) {
			router.push(url)
		} else {
			router.back()
		}
	}

	return (
		<div className='self-start '>
			<Button
				className='cursor-pointer'
        type='button'
				variant={'outline'}
				onClick={handleBackClick}
			>
				<ArrowLeft />
			</Button>
		</div>
	)
}
