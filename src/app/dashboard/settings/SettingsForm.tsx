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
import { useProfile, useUpdateProfileMutation } from '@/shared/hooks'
import { settingsSchema, TypeSettingsSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const SettingsForm = () => {
	const { user, isLoadingProfile } = useProfile()

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
				<CardTitle>Profile settings</CardTitle>
				{isLoadingProfile ? (
					<UserButtonLoading />
				) : (
					<UserButton user={user} />
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
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder='Enter your name'
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
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder='Enter your email'
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
														Two factor
														authentication
													</FormLabel>
													<FormDescription>
														Enable two factor
														authentication to secure
														your account
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
										Save
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
