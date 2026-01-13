'use client'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Switch
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import { UserButton, UserButtonLoading } from '@/shared/componets/UserButton'
import { useProfile, useUpdateProfileMutation, useTranslations } from '@/shared/hooks'
import { settingsSchema, TypeSettingsSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRef, useState } from 'react'

const SettingsForm = () => {
	const { user, isLoadingProfile } = useProfile()
	const { t } = useTranslations()
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [originalUrl, setOriginalUrl] = useState<string | null>(null)
	const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(settingsSchema),
		values: {
			email: user?.email || '',
			name: user?.displayName || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
			picture: user?.picture || ''
		}
	})

	const { updateProfile, isLoadingUpdateProfile } = useUpdateProfileMutation()

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsLoadingAvatar(true)
		const file = event.target.files?.[0]
		if (!file) return

		// Перевірка розміру файлу (5 МБ)
		const maxSize = 5 * 1024 * 1024
		if (file.size > maxSize) {
			form.setError('picture', {
				type: 'manual',
				message: t('maxFileSizeIs5MB')
			})
			setIsLoadingAvatar(false)
			return
		}

		form.clearErrors('picture')

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
				form.setValue('picture', data.secure_url, {
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
				form.setError('picture', {
					type: 'manual',
					message: t('errorUploadingPhotoToServer')
				})
				setIsLoadingAvatar(false)
			}
		} catch (error) {
			form.setError('picture', {
				type: 'manual',
				message: t('errorUploadingPhotoToServer')
			})
			setIsLoadingAvatar(false)
		}
	}

	const handleButtonClick = () => {
		fileInputRef.current?.click()
	}

	const onSubmit = (data: TypeSettingsSchema) => {
		updateProfile(data)
	}

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle>{t('profileSettings')}</CardTitle>
				{isLoadingProfile ? (
					<UserButtonLoading />
				) : (
					<div className='flex items-center gap-0.5'>
						
						<UserButton user={user} />
					</div>
				)}
			</CardHeader>
			{isLoadingProfile ? (
				<Loading />
			) : (
				<>
					<CardContent>
						{isLoadingProfile ? (
							<Loading />
						) : (
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
												<FormLabel>{t('name')}</FormLabel>
												<FormControl>
													<Input
														placeholder={t('enterYourName')}
														disabled={
															isLoadingUpdateProfile
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='picture'
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('avatar')}</FormLabel>
												<FormControl>
													<div>
														<div className='flex gap-4 items-center'>
															<div
																className='flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors'
																onClick={handleButtonClick}
															>
																<span className='text-gray-600 font-medium'>
																	{isLoadingAvatar
																		? t('uploading')
																		: t('uploadPhoto')}
																</span>
															</div>

															{previewUrl || user?.picture ? (
																<div className='mt-2'>
																	<a
																		href={originalUrl || user?.picture || '#'}
																		target='_blank'
																		rel='noopener noreferrer'
																		title={t('openOriginalImage')}
																	>
																		<img
																			src={previewUrl || user?.picture}
																			alt={t('avatarPreview')}
																			className='h-24 w-24 min-w-24 object-cover block rounded-full hover:opacity-80 transition-opacity'
																		/>
																	</a>
																</div>
															) : (
																<div className='h-24 w-24 flex-shrink-0 flex items-center justify-center text-2xl leading-24 text-center rounded-full hover:opacity-80 transition-opacity bg-muted-foreground/10'>
																	{user?.displayName
																		?.slice(0, 2)
																		.toUpperCase()}
																</div>
															)}
														</div>

														<input
															type='file'
															accept='image/*'
															ref={fileInputRef}
															className='hidden'
															disabled={isLoadingUpdateProfile || isLoadingAvatar}
															onChange={handleFileChange}
														/>
														<input
															type='hidden'
															{...field}
														/>
													</div>
												</FormControl>
												{form.formState.errors.picture && (
													<div className='text-red-500 text-sm mt-2 text-center'>
														{form.formState.errors.picture.message}
													</div>
												)}
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('emailLabel')}</FormLabel>
												<FormControl>
													<Input
														placeholder={t('enterYourEmail')}
														type='email'
														disabled={
															isLoadingUpdateProfile
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='isTwoFactorEnabled'
										render={({ field }) => (
											<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
												<div className='space-y-0.5'>
													<FormLabel>
														{t('twoFactorAuth')}
													</FormLabel>
													<FormDescription>
														{t('twoFactorDescription')}
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<Button
										disabled={isLoadingUpdateProfile}
										type='submit'
									>
										{t('save')}
									</Button>
								</form>
							</Form>
						)}
					</CardContent>
				</>
			)}
		</Card>
	)
}
export default SettingsForm
