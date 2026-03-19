'use client'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/componets/ui'
import { useProfile, useTranslations, useUpdateProfileMutation } from '@/shared/hooks'
import { settingsSchema, TypeSettingsSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const CardManagementCard = () => {
	const { user } = useProfile()
	const { t } = useTranslations()
	const { updateProfile, isLoadingUpdateProfile } = useUpdateProfileMutation()
	const [confirmDeleteCard, setConfirmDeleteCard] = useState(false)

	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(settingsSchema),
		values: {
			email: user?.email || '',
			name: user?.displayName || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
			picture: user?.picture || '',
			cardNumber: user?.cardNumber ?? null,
			cardVisibility: user?.cardVisibility || 'EVERYONE'
		}
	})

const maskCardNumber = (number: string) => {
		const last4 = number.replace(/\s/g, '').slice(-4)
		return `**** **** **** ${last4}`
	}

	const handleCardNumberInput = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 16)
		return digits.replace(/(.{4})/g, '$1 ').trim()
	}

	const handleDeleteCard = () => {
		updateProfile({ ...form.getValues(), cardNumber: null })
	}

	const onSubmit = (data: TypeSettingsSchema) => {
		updateProfile(data)
	}

	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>{t('paymentCard')}</CardTitle>
					{user?.cardNumber && (
						<Button
							type='button'
							size='icon'
							variant='ghost'
							className='size-6 text-bad-red hover:bg-bad-red/10 hover:text-bad-red'
							disabled={isLoadingUpdateProfile}
							onClick={() => setConfirmDeleteCard(true)}
						>
							<Trash2 className='size-3.5' />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
						{user?.cardNumber && (
							<p className='text-xs text-muted-foreground'>
								{t('currentCard')}:{' '}
								<span className='font-mono'>{maskCardNumber(user.cardNumber)}</span>
							</p>
						)}

						<div className='flex flex-col gap-2'>
							<FormField
								control={form.control}
								name='cardNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('cardNumber')}</FormLabel>
										<FormControl>
											<Input
												placeholder={t('enterCardNumber')}
												disabled={isLoadingUpdateProfile}
												value={field.value ?? ''}
												onChange={e => {
													field.onChange(handleCardNumberInput(e.target.value) || null)
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='cardVisibility'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('cardVisibility')}</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={isLoadingUpdateProfile}
										>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='EVERYONE'>{t('cardVisibilityEveryone')}</SelectItem>
												<SelectItem value='FRIENDS_ONLY'>{t('cardVisibilityFriendsOnly')}</SelectItem>
												<SelectItem value='ON_REQUEST'>{t('cardVisibilityOnRequest')}</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button disabled={isLoadingUpdateProfile} type='submit'>
							{t('save')}
						</Button>
					</form>
				</Form>

				<Dialog open={confirmDeleteCard} onOpenChange={setConfirmDeleteCard}>
					<DialogContent className='w-[90vw] max-w-sm rounded-md'>
						<DialogTitle>{t('deleteCard')}</DialogTitle>
						<p className='text-sm'>{t('areYouAbsolutelySure')}</p>
						<DialogFooter className='flex gap-2'>
							<Button
								variant='outline'
								className='flex-1'
								onClick={() => setConfirmDeleteCard(false)}
							>
								{t('cancel')}
							</Button>
							<Button
								className='flex-1 bg-bad-red hover:bg-bad-red/80'
								disabled={isLoadingUpdateProfile}
								onClick={() => {
									handleDeleteCard()
									setConfirmDeleteCard(false)
								}}
							>
								{t('deleteCard')}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	)
}
