'use client'

import { zodResolver } from '@hookform/resolvers/zod'
// import { uk } from 'date-fns/locale'
import React, { use, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/shared/componets/ui/Popover'
import { cn } from '@/shared/utils'
import { format, set } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/shared/componets/ui/Calendar'
import {
	addGroupSchema,
	TypeAddGroupSchema
} from '@/shared/schemas/createGroup.schema'
import { useGroup } from '@/shared/hooks'
import { Loading } from '@/shared/componets/ui/Loading'
import { editGroupSchema, TypeEditGroupSchema } from '@/shared/schemas'
import { useEditGroupMutation } from '@/shared/hooks/useEditGroupMutation'

type Props = {
	groupId: string
}

export const EditGroupForm = ({ groupId }: Props) => {
	const { group, isLoadingGroup } = useGroup(groupId)

	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [originalUrl, setOriginalUrl] = useState<string | null>(null)
	const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const form = useForm<TypeEditGroupSchema>({
		resolver: zodResolver(editGroupSchema),

		values: {
			groupId: group?.id || groupId,
			name: group?.name || '',
			avatarUrl: (group?.avatarUrl as string) || '',
			eventDate: new Date(group?.eventDate!) || new Date()
		}
	})


	const { editGroup, isLoadingEditGroup } = useEditGroupMutation(groupId)

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsLoadingAvatar(true)
		const file = event.target.files?.[0]
		if (!file) return

		// Перевірка розміру файлу (5 МБ)
		const maxSize = 5 * 1024 * 1024 // 5MB у байтах
		if (file.size > maxSize) {
			form.setError('avatarUrl', {
				type: 'manual',
				message: 'Файл занадто великий! Максимальний розмір 5 МБ.'
			})
			setIsLoadingAvatar(false)
			return
		}

		// Очищаємо помилку, якщо розмір файлу валідний
		form.clearErrors('avatarUrl')

		const formData = new FormData()
		formData.append('file', file)
		formData.append(
			'upload_preset',
			process.env.CLOUDINARY_UPLOAD_PRESET as string
		)

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: 'POST',
					body: formData
				}
			)

			const data = await response.json()
			if (data.secure_url) {
				form.setValue('avatarUrl', data.secure_url, {
					shouldValidate: true
				})
				setOriginalUrl(data.secure_url)
				const optimizedUrl = data.secure_url.replace(
					'/upload/',
					'/upload/w_200,h_200,c_fill,f_webp,q_80/'
				)
				setPreviewUrl(optimizedUrl)
				setIsLoadingAvatar(false)
			} else {
				form.setError('avatarUrl', {
					type: 'manual',
					message: 'Помилка завантаження зображення на Cloudinary.'
				})
				setIsLoadingAvatar(false)
			}
		} catch (error) {
			form.setError('avatarUrl', {
				type: 'manual',
				message: 'Помилка при завантаженні на Cloudinary.'
			})
			setIsLoadingAvatar(false)
		}
	}

	const handleButtonClick = () => {
		// Активуємо прихований input при кліку на прямокутник
		fileInputRef.current?.click()
	}

	const avatarUrl = form.watch('avatarUrl')
	const name = form.watch('name')

	const onSubmit = (data: TypeEditGroupSchema) => {
		editGroup({ values: data })
	}

	useEffect(() => {
		if (group !== undefined) {
			setPreviewUrl((group.avatarUrl as string) || null)
		}
	}, [group])

	if (isLoadingGroup) {
		return <Loading />
	}
	return (
		<div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>Edit group</CardTitle>
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
										<FormLabel>Group name</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter group name'
												disabled={isLoadingEditGroup}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='avatarUrl'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Avatar </FormLabel>
										<FormControl>
											<div>
												{/* Кастомний прямокутник */}
												<div className='flex gap-4 items-center'>
													<div
														className='flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors'
														onClick={
															handleButtonClick
														}
													>
														<span className='text-gray-600 font-medium'>
															{isLoadingAvatar
																? 'Завантажую ...'
																: 'Завантажити фото'}
														</span>
													</div>

													{previewUrl ? (
														<div className='mt-2'>
															<a
																href={
																	originalUrl ||
																	'#'
																}
																target='_blank'
																rel='noopener noreferrer'
																title='Відкрити оригінальне зображення'
															>
																<img
																	src={
																		previewUrl
																	}
																	alt='Попередній перегляд аватара'
																	className='h-24 w-24 min-w-24 object-cover block rounded-full hover:opacity-80 transition-opacity'
																/>
															</a>
														</div>
													) : (
														<div className='h-24 w-24 flex-shrink-0  leading-24 text-center rounded-full hover:opacity-80 transition-opacity bg-muted-foreground/10'>
															{form
																.getValues(
																	'name'
																)
																.slice(0, 2)
																.toUpperCase()}
														</div>
													)}
												</div>

												{/* Прихований input */}
												<input
													type='file'
													accept='image/*'
													ref={fileInputRef}
													className='hidden'
													onChange={handleFileChange}
												/>
												<input
													type='hidden'
													disabled={
														isLoadingEditGroup
													}
													{...field}
												/>
												{/* Попередній перегляд */}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='eventDate'
								render={({ field }) => (
									<FormItem className='flex flex-col'>
										<FormLabel>Date of event</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={'outline'}
														className={cn(
															'pl-3 text-left font-normal',
															!field.value &&
																'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(
																field.value,
																'PPP'
															)
														) : (
															<span>
																Pick a date
															</span>
														)}
														<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className='w-auto p-0'
												align='start'
											>
												<Calendar
													mode='single'
													selected={field.value}
													onSelect={field.onChange}
													disabled={date =>
														date > new Date() ||
														date <
															new Date(
																'2000-01-01'
															)
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit'>Edit group</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
