import { Metadata } from 'next'
import GroupsData from './GroupsData'

export const metadata: Metadata = {
	title: 'Groups'
}

type Props = {}

const GroupsPage = (props: Props) => {
	return (
		<div>
			<GroupsData />
		</div>
	)
}

export default GroupsPage
