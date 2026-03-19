import { CardManagementCard } from './CardManagementCard'
import { CardRequestsData } from './CardRequestsData'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Card Requests'
}

const CardRequestsPage = () => {
	return (
		<div className='flex flex-col items-center gap-3 py-18'>
			<CardManagementCard />
			<CardRequestsData />
		</div>
	)
}

export default CardRequestsPage
