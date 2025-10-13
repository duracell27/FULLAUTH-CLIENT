import { Metadata } from 'next'
import VersionClient from './VersionClient'

export const metadata: Metadata = {
	title: 'Version - Lendower',
	description: 'Lendower version information and changelog'
}

export default function VersionPage() {
	return <VersionClient />
}
