'use client'
import { AuthWrapper } from '@/shared/componets/AuthWrapper'
import {
	BackButton,
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/componets/ui'
import { useRegisterMutation, useTranslations } from '@/shared/hooks'
import { registerSchema, TypeRegisterSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {}

const RegisterForm = (props: Props) => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const { t, locale } = useTranslations()

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { register, isLoadingRegister } = useRegisterMutation()

	const onSubmit = (data: TypeRegisterSchema) => {
		if (recaptchaValue) {
			register({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error(t('pleaseCompleteTheCaptcha'))
		}
	}
	return (
		<>
			{' '}
			<BackButton />
			<AuthWrapper
				heading={t('register')}
				description={t('provideYourEmailNamePassword')}
				backButtonLabel={t('alreadyHaveAnAccountLogin')}
				backButtonHref='/auth/login'
				isShowSocial
			>
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
											disabled={isLoadingRegister}
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
									<FormLabel>{t('emailLabel')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('enterYourEmail')}
											type='email'
											disabled={isLoadingRegister}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('password')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('enterYourPassword')}
											type='password'
											disabled={isLoadingRegister}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='passwordRepeat'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('passwordRepeat')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												'repeatYourPassword'
											)}
											type='password'
											disabled={isLoadingRegister}
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
									process.env
										.GOOGLE_RECAPTCHA_SITE_KEY as string
								}
								onChange={setRecaptchaValue}
								theme={theme === 'dark' ? 'dark' : 'light'}
								hl={locale}
							/>
						</div>

						<Button disabled={isLoadingRegister} type='submit'>
							{t('register')}
						</Button>
					</form>
				</Form>
			</AuthWrapper>{' '}
		</>
	)
}

export default RegisterForm
