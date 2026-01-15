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
import { useRegisterMutation, useResetPasswordMutation, useTranslations } from '@/shared/hooks'
import {
	registerSchema,
	resetPasswordSchema,
	TypePasswordResetSchema,
	TypeRegisterSchema
} from '@/shared/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {}

const ResetPasswordForm = (props: Props) => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const { t, locale } = useTranslations()

	const form = useForm<TypePasswordResetSchema>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const { reset, isLoadingReset } = useResetPasswordMutation()

	const onSubmit = (data: TypePasswordResetSchema) => {
		if (recaptchaValue) {
			reset({ values: data, recaptcha: recaptchaValue })
		} else {
			toast.error(t('pleaseCompleteTheCaptcha'))
		}
	}
	return (
		<AuthWrapper
			heading={t('passwordReset')}
			description={t('enterYourEmailToResetYourPassword')}
			backButtonLabel={t('login')}
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2 space-y-2'
				>
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
										disabled={isLoadingReset}
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
							hl={locale}
						/>
					</div>

					<Button disabled={isLoadingReset} type='submit'>
						{t('passwordReset')}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}

export default ResetPasswordForm
