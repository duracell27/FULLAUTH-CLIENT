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
import { useLoginMutation, useTranslations } from '@/shared/hooks'
import { loginSchema, TypeLoginSchema } from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {}

export const LoginForm = (props: Props) => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
	const { t, locale } = useTranslations()

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const { login, isLoadingLogin } = useLoginMutation(setIsShowTwoFactor)

	const onSubmit = (data: TypeLoginSchema) => {
		if (recaptchaValue) {
			login({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error(t('pleaseCompleteTheCaptcha'))
		}
	}
	return (
		<> <BackButton/> 
		<AuthWrapper
			heading={t('login')}
			description={t('provideYourEmailAndPassword')}
			backButtonLabel={t('dontHaveAnAccountRegister')}
			backButtonHref='/auth/register'
			isShowSocial
		>
			
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
					{isShowTwoFactor && (
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('twoFactorCode')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('enterYourCode')}
											type='text'
											disabled={isLoadingLogin}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					{!isShowTwoFactor && (
						<>
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
											disabled={isLoadingLogin}
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
										<div className='flex items-center justify-between'>
											<FormLabel>{t('password')}</FormLabel>
											<Link
												href='/auth/reset-password'
												className='ml-auto inline-block text-sm underline'
											>
												{t('forgotPassword')}
											</Link>
										</div>
										<FormControl>
											<Input
												placeholder={t('enterYourPassword')}
												type='password'
												disabled={isLoadingLogin}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<div className='flex justify-center'>
						<ReCAPTCHA
							sitekey={
								process.env.GOOGLE_RECAPTCHA_SITE_KEY as string
							}
							onChange={setRecaptchaValue}
							theme={theme === 'dark' ? 'dark' : 'light'}
							hl={locale}
						/>
					</div>

					<Button disabled={isLoadingLogin} type='submit'>
						{t('login')}
					</Button>
				</form>
			</Form>
		</AuthWrapper></>
	)
}
