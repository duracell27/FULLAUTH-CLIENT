'use client'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import { useFriends, useProfile } from '@/shared/hooks'
import { useAddMemberToGroupMutation } from '@/shared/hooks/useAddMemberToGroupMutation'
import { useProfileByNameSafe } from '@/shared/hooks/useProfileByNameSafe'
import {
	searchUserSchema,
	TypeSearchUserSchema
} from '@/shared/schemas/searchUser.schema'
import { IUserSafe } from '@/shared/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { set } from 'date-fns'
import React, { useState } from 'react'

import { useForm } from 'react-hook-form'

type Props = {
	groupId: string
}

export const MemberData = (props: Props) => {
	const [searchName, setSearchName] = useState<string>('')
	const { users, isLoadingProfile } = useProfileByNameSafe(searchName)
	const { addMember, isLoadingAddMember } = useAddMemberToGroupMutation(
		props.groupId
	)
	const { friendsData, isLoadingFriend } = useFriends()
	const { user } = useProfile()
	

	const form = useForm<TypeSearchUserSchema>({
		resolver: zodResolver(searchUserSchema),
		defaultValues: {
			name: ''
		}
	})

	const onSubmit = (data: TypeSearchUserSchema) => {
		setSearchName(data.name)
	}

	const handleAddMember = (recieverId: string) => {
		addMember({ values: { groupId: props.groupId, userId: recieverId } })
		setSearchName('')
	}

	return (
		<>
			<BackButton />
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>Search user</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='grid gap-2 space-y-2'
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder='Type user name ...'
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button disabled={isLoadingProfile} type='submit'>Search</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>Results</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						{users?.length === 0 && <div>No results</div>}
						{users &&
							users.map(user => (
								<li
									className='flex w-full items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
									key={user.id}
								>
									<div className='flex w-full gap-2 items-center'>
										<Avatar>
											<AvatarImage src={user.picture} />
											<AvatarFallback>
												{user.displayName
													.slice(0, 2)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex w-full gap-2 items-center'>
											<span className='font-bold flex-1'>
												{user.displayName}
											</span>
											<Button
												disabled={isLoadingAddMember}
												onClick={() =>
													handleAddMember(user.id)
												}
											>
												Invite
											</Button>
										</div>
									</div>
								</li>
							))}
					</ul>
				</CardContent>
			</Card>

			{friendsData && friendsData?.friends.length > 0 && (
				<Card className='w-full max-w-[400px]'>
					<CardHeader>
						<CardTitle>Or from friends</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{friendsData.friends.map(friend => (
								<li
									className='flex w-full items-center gap-2 font-medium border-b border-ring/20 py-2 hover:bg-accent'
									key={friend.id}
								>
									<div className='flex w-full gap-2 items-center'>
										<Avatar>
											<AvatarImage
												src={
													friend.senderId === user?.id
														? friend?.receiver
																?.picture
														: friend?.sender
																?.picture
												}
											/>
											<AvatarFallback>
												{friend.senderId === user?.id
													? friend.receiver.displayName
															.slice(0, 2)
															.toUpperCase()
													: friend.sender.displayName
															.slice(0, 2)
															.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex w-full gap-2 items-center'>
											<span className='font-bold flex-1'>
												{friend.senderId === user?.id
													? friend.receiver
															.displayName
													: friend.sender.displayName}
											</span>
											<Button
												disabled={isLoadingAddMember}
												onClick={() =>
													handleAddMember(
														friend.senderId ===
															user?.id
															? friend.receiverId
															: friend.senderId
													)
												}
											>
												Invite
											</Button>
										</div>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</>
	)
}
