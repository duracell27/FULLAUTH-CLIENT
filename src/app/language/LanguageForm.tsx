'use client'

import { zodResolver } from '@hookform/resolvers/zod'
// import { uk } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
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
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/componets/ui'
import { useProfile, useTranslations } from '@/shared/hooks'
import { BackButton } from '@/shared/componets/ui/BackButton'
import {
	changeLanguageSchema,
	TypeChangeLanguageSchema
} from '@/shared/schemas/changeLanguage.schema'
import { Language } from '@/shared/types/user.types'
import { useChangeLanguageMutation } from '@/shared/hooks/useChangeLanguageMutation'
import { cookieUtils } from '@/shared/utils/cookie'

type Props = {}

export const ChangeLanguageForm = (props: Props) => {

	const { user, isLoadingProfile } = useProfile()
	const { t } = useTranslations()
	const { changeLanguage, isLoadingChangeLanguage } =
		useChangeLanguageMutation()

	const form = useForm<TypeChangeLanguageSchema>({
		resolver: zodResolver(changeLanguageSchema),
		defaultValues: {
			language: Language.EN // Початкове значення, буде оновлено в useEffect
		}
	})

	// Ключ для примусового перерендерингу форми
	const [formKey, setFormKey] = useState(0)

	// Оновлюємо форму коли user завантажиться або зміниться
	useEffect(() => {
		if (!isLoadingProfile && user?.language) {
			form.setValue('language', user.language)
			setFormKey(prev => prev + 1) // Примусово перерендерити форму
		} else if (!isLoadingProfile && !user?.language) {
			// Якщо user немає, беремо з cookie
			const languageFromCookie = cookieUtils.getLanguage()
			form.setValue('language', languageFromCookie)
			setFormKey(prev => prev + 1) // Примусово перерендерити форму
		}
	}, [user?.language, isLoadingProfile, form])

	const onSubmit = (data: TypeChangeLanguageSchema) => {
		changeLanguage({ values: data })
	}

	// Показуємо loading поки профіль завантажується
	if (isLoadingProfile) {
		return (
			<div className='flex flex-col gap-3 justify-start items-center mt-24 w-full pt-18'>
				<BackButton />
				<Card className='w-full max-w-[400px]'>
					<CardHeader>
						<CardTitle>{t('changeLanguage')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-center py-8'>
							<div className='text-sm text-muted-foreground'>Loading...</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-3 justify-start items-center mt-24 w-full  pt-18'>
			<BackButton />
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>{t('changeLanguage')}</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							key={formKey}
							onSubmit={form.handleSubmit(onSubmit)}
							className='grid gap-2 space-y-2'
						>
							<FormField
								control={form.control}
								name='language'
								render={({ field }) => {
									return (
									<FormItem>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder={t('selectLanguage')}>
														{field.value && (
															<span>
																{field.value === Language.EN && 'English (US) 🇺🇸'}
																{field.value === Language.UK && 'Ukrainian 🇺🇦'}
																{field.value === Language.DE && 'German 🇩🇪'}
																{field.value === Language.ES && 'Spanish 🇪🇸'}
																{field.value === Language.FR && 'French 🇫🇷'}
																{field.value === Language.CS && 'Czech 🇨🇿'}
																{field.value === Language.PL && 'Polish 🇵🇱'}
																{field.value === Language.TR && 'Turkish 🇹🇷'}
																{field.value === Language.HI && 'Hindi 🇮🇳'}
																{field.value === Language.ZH && 'Chinese 🇨🇳'}
															</span>
														)}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													<SelectItem
														value={Language.EN}
													>
														English (US) 🇺🇸
													</SelectItem>
													<SelectItem
														value={Language.UK}
													>
														Ukrainian 🇺🇦
													</SelectItem>

													<SelectItem
														value={Language.DE}
													>
														German 🇩🇪
													</SelectItem>

													<SelectItem
														value={Language.ES}
													>
														Spanish 🇪🇸
													</SelectItem>

													<SelectItem
														value={Language.FR}
													>
														French 🇫🇷
													</SelectItem>

													<SelectItem
														value={Language.CS}
													>
														Czech 🇨🇿
													</SelectItem>

													<SelectItem
														value={Language.PL}
													>
														Polish 🇵🇱
													</SelectItem>

													<SelectItem
														value={Language.TR}
													>
														Turkish 🇹🇷
													</SelectItem>

													<SelectItem
														value={Language.HI}
													>
														Hindi 🇮🇳
													</SelectItem>

													<SelectItem
														value={Language.ZH}
													>
														Chinese 🇨🇳
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
									)
								}}
							/>

							<Button
								disabled={isLoadingChangeLanguage}
								type='submit'
								>
									{t('changeLanguage')}
								</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
