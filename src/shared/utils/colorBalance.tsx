import React from 'react'
import { formatBalance, formatNumberWithSpaces } from './formatBalance'
import { cn } from './clsx'

type Props = {
	balance: number | string
	fontSize?: string
	type?: 'bage'
}

export default function colorBalance({ balance, fontSize, type }: Props) {
	const balanceNumber = formatBalance(balance)

	const getClassByTypePositive = () =>
		type === 'bage'
			? 'bg-good-green text-background px-2 rounded-full'
			: 'text-good-green'

	const getClassByTypeNegative = () =>
		type === 'bage'
			? 'bg-bad-red text-background px-2 rounded-full'
			: 'text-bad-red'

	const getClassByTypeNeutral = () =>
		type === 'bage'
			? 'bg-neutral-grey text-background px-2 rounded-full'
			: 'text-neutral-grey'
	return (
		<span className={cn('text-xs text-neutral-grey', fontSize)}>
			{balanceNumber > 0 && (
				<span className={getClassByTypePositive()}>
					+{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
			{balanceNumber === 0 && (
				<span className={getClassByTypeNeutral()}>
					{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
			{balanceNumber < 0 && (
				<span className={getClassByTypeNegative()}>
					{formatNumberWithSpaces(balanceNumber)}
				</span>
			)}
		</span>
	)
}
