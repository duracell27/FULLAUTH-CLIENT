import React from 'react'
import { formatBalance, formatNumberWithSpaces } from './formatBalance'

type Props = {
	balance: number | string
}

export default function colorBalance({ balance }: Props) {
	const balanceNumber = formatBalance(balance)
	return (
		<p className='inline'>
			{balanceNumber > 0 && (
				<span className='text-xs text-good-green'>
					+{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
			{balanceNumber === 0 && (
				<span className='text-xs text-neutral-grey'>
					{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
			{balanceNumber < 0 && (
				<span className='text-xs text-bad-red'>
					{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
		</p>
	)
}
