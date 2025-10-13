import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import React from 'react'
import { SummaryData } from './SummaryData'
import { Metadata } from 'next'
import { SummaryPageClient } from './SummaryPageClient'

export const metadata: Metadata = {
	title: 'Summary'
}

type Props = {}

const SummaryPage = (props: Props) => {
	return <SummaryPageClient />
}

export default SummaryPage
