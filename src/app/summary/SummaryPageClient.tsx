'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'
import { SummaryData } from './SummaryData'
import { useTranslations } from '@/shared/hooks'
import { useSummary } from '@/shared/hooks/useSummary'
import colorBalance from '@/shared/utils/colorBalance'

type Props = {}

export const SummaryPageClient = (props: Props) => {
	const { t } = useTranslations()
	const { totalBalance } = useSummary()

	return (
		<div className='flex flex-col gap-3 justify-center items-center py-18 w-full max-w-[400px]'>
			<div className='flex justify-between items-center w-full'>
				<Card className='w-full'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>{t('summary')}</span>
							{totalBalance !== undefined && (
								<div>
									{colorBalance({
										balance: totalBalance,
										fontSize: 'text-lg',
										type: 'bage'
									})}
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SummaryData />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
