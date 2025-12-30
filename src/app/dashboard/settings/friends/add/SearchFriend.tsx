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
	FormMessage,
	Input
} from '@/shared/componets/ui'
import { useTranslations } from '@/shared/hooks'
import { useAddFriendMutation } from '@/shared/hooks/useAddFriendMutation'
import { useProfileByNameSafe } from '@/shared/hooks/useProfileByNameSafe'
import {
	searchUserSchema,
	TypeSearchUserSchema
} from '@/shared/schemas/searchUser.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {}

export const SearchFriend = (props: Props) => {
	const [searchName, setSearchName] = useState<string>('')
	const { users, isLoadingProfile } = useProfileByNameSafe(searchName)
	const { addFriend, isLoadingAddFriend } = useAddFriendMutation()
	const { t } = useTranslations()

	const form = useForm<TypeSearchUserSchema>({
		resolver: zodResolver(searchUserSchema),
		defaultValues: {
			name: ''
		}
	})

	const onSubmit = (data: TypeSearchUserSchema) => {
		setSearchName(data.name)
	}

	const handleAddFriend = (userId: string) => {
		addFriend(userId)
		setSearchName('')
		form.reset()
	}

	return (
		<>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>{t('searchUser')}</CardTitle>
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
												placeholder={t('typeUserName')}
												type='text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button disabled={isLoadingProfile} type='submit'>
								{t('search')}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			{searchName && (
				<Card className='w-full max-w-[400px]'>
					<CardHeader>
						<CardTitle>{t('results')}</CardTitle>
					</CardHeader>
					<CardContent>
						<ul>
							{users?.length === 0 && <div>{t('noResults')}</div>}
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
													disabled={isLoadingAddFriend}
													onClick={() =>
														handleAddFriend(user.id)
													}
												>
													{t('sendRequest')}
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
