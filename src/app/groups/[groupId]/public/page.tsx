import { PublicGroupData } from './PublicGroupData'

type Props = {
	params: Promise<{ groupId: string }>
}

const PublicGroupPage = async ({ params }: Props) => {
	const { groupId } = await params
	return (
		<div className='flex flex-col items-center py-18'>
			<PublicGroupData groupId={groupId} />
		</div>
	)
}

export default PublicGroupPage
