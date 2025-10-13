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
import { ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'

const SettingsForm = () => {
	const { user, isLoadingProfile } = useProfile()
	const { t } = useTranslations()

	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(settingsSchema),
		values: {
			email: user?.email || '',
			name: user?.displayName || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false
		}
	})

	const { updateProfile, isLoadingUpdateProfile } = useUpdateProfileMutation()

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
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('email')}</FormLabel>
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
