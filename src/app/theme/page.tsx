import React from 'react'
import { ThemePageClient } from './ThemePageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Site theme'
}

type Props = {}

const ThemePage = (props: Props) => {
  return <ThemePageClient />
}

export default ThemePage