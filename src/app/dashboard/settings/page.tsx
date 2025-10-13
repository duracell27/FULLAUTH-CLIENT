import React from 'react'
import SettingsForm from './SettingsForm'
import { SettingsMenu } from './SettingsMenu'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Profile settings'
}

const SettingsPage = () => {
	return (
		<div className='flex flex-col gap-3 justify-start items-center mb-18 pt-18'>
			<SettingsForm />
			<SettingsMenu />
		</div>
	)
}

export default SettingsPage
