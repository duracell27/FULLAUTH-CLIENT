'use client'
import { AuthWrapper } from '@/shared/componets/AuthWrapper'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/componets/ui'
import { useNewPasswordMutation } from '@/shared/hooks'
import { newPasswordSchema, TypeNewPasswordSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {}

const NewPasswordForm = (props: Props) => {
	const { theme } = useTheme()
	
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<TypeNewPasswordSchema>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const { newPassword, isLoadingNewPassword } = useNewPasswordMutation()

	const onSubmit = (data: TypeNewPasswordSchema) => {
		if (recaptchaValue) {
			newPassword({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error('Please complete the captcha')
		}
	}
	return (
		<AuthWrapper
			heading='New password'
			description='Please enter your new password'
			backButtonLabel='Login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your new password'
										type='password'
										disabled={isLoadingNewPassword}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-center'>
						<ReCAPTCHA
							sitekey={
								process.env.GOOGLE_RECAPTCHA_SITE_KEY as string
							}
							onChange={setRecaptchaValue}
							theme={theme === 'dark' ? 'dark' : 'light'}
						/>
					</div>

					<Button disabled={isLoadingNewPassword} type='submit'>
						Continue
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}

export default NewPasswordForm
