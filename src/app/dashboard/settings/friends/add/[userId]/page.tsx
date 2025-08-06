import { Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { UserAddCard } from './UserAddCard'

const AddUserForFriendPage = async ({
	params
}: {
	params: Promise<{ userId: string }>
}) => {

    const {userId} = await params

	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full'>
			<div className='flex justify-between items-center w-full'>
				<BackButton />
			</div>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>Send friend request</CardTitle>
				</CardHeader>
				<CardContent>
                    <UserAddCard userId={userId} />
                </CardContent>
			</Card>
		</div>
	)
}

export default AddUserForFriendPage
