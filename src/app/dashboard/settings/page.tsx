import React from 'react'
import { SettingsForm } from './SettingsForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Profile settings'
}

const SettingsPage = () => {
	return <SettingsForm />
}

export default SettingsPage
