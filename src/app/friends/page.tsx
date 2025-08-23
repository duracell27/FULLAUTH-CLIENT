import React from 'react'
import FriendsGroups from './FriendsGroups'

type Props = {}

const FriendsGroupPage = (props: Props) => {
	return (
		<div className='flex flex-col gap-3 justify-center items-center w-full max-w-[400px] pt-18'>
			<FriendsGroups />
		</div>
	)
}

export default FriendsGroupPage
