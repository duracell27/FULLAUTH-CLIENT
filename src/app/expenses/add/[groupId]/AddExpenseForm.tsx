'use client'
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
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	RadioGroup,
	RadioGroupItem,
	Checkbox,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Calendar
} from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import {
	useEditExpenseMutation,
	useExpenseFormData,
	useGroup,
	useTranslations
} from '@/shared/hooks'
import { useProfile } from '@/shared/hooks/useProfile'
import { useAddExpenseMutation } from '@/shared/hooks/useAddExpenseMutation'
import { Language } from '@/shared/types/user.types'

import {
	addExpenseSchema,
	createExpenseSchema,
	TypeAddExpenseForm,
	TypeAddExpenseFormNumber
} from '@/shared/schemas'
import { cn } from '@/shared/utils'
import { formatBalance } from '@/shared/utils/formatBalance'

import { zodResolver } from '@hookform/resolvers/zod'
import { formatDate } from '@/shared/utils'
import { CalendarIcon } from 'lucide-react'

import React, { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

type Props = {
	groupId: string
	expenseId?: string
	edit?: boolean
}

type transformedPayers = { userId: string; amount: number }
type transformedDebtors = {
	userId: string
	amount?: number
	percentage?: number
	shares?: number
	extraAmount?: number
}

const AddExpenseForm = ({ groupId, expenseId = '', edit }: Props) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null) // Оптимізована версія для прев'ю
	const [originalUrl, setOriginalUrl] = useState<string | null>(null)
	const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { t, isLoading: isLoadingTranslations } = useTranslations()
	const { user } = useProfile()

	const [paymentMode, setPaymentMode] = useState<'single' | 'multiple'>(
		'single'
	)
	const [debtorMode, setDebtorMode] = useState<
		'EQUAL' | 'CUSTOM' | 'PERCENTAGE' | 'SHARES' | 'EXTRA'
	>('EQUAL')

	const { group, isLoadingGroup } = useGroup(groupId)
	const { expenseFormData, isLoadingExpenseFormData } = useExpenseFormData(
		edit ? expenseId : ''
	)

	const { editExpense, isLoadingEditExpense } = useEditExpenseMutation(
		groupId,
		expenseId
	)

	useEffect(() => {
		if (edit && expenseFormData) {
			const transformedPayers = expenseFormData.payers.map(p => ({
				userId: p.userId,
				amount: p.amount.toString()
			}))

			if (transformedPayers.length > 1) {
				setPaymentMode('multiple')
			} else {
				setPaymentMode('single')
			}

			const transformedDebtors = expenseFormData.debtors.map(d => ({
				userId: d.userId,
				amount: d.amount?.toString(),
				percentage: d.percentage?.toString(),
				shares: d.shares?.toString(),
				extraAmount: d.extraAmount?.toString()
			}))

			setDebtorMode(
				expenseFormData.splitType as
					| 'EQUAL'
					| 'CUSTOM'
					| 'PERCENTAGE'
					| 'SHARES'
					| 'EXTRA'
			)

			form.reset({
				description: expenseFormData.description,
				amount: expenseFormData.amount.toString(),
				groupId: expenseFormData.groupId,
				splitType: expenseFormData.splitType as
					| 'EQUAL'
					| 'CUSTOM'
					| 'PERCENTAGE'
					| 'SHARES'
					| 'EXTRA',
				photoUrl: expenseFormData.photoUrl,
				date: new Date(expenseFormData.date as Date),
				payers: transformedPayers,
				debtors: transformedDebtors
			})
		}
	}, [edit, expenseFormData])

	const { addExpense, isLoadingAddExpense } = useAddExpenseMutation(groupId)

	// Створюємо схему з перекладами
	const translatedSchema = createExpenseSchema(t)

	const form = useForm<TypeAddExpenseForm>({
		resolver: zodResolver(translatedSchema),
		defaultValues: {
			description: '',
			amount: '',
			groupId,
			splitType: debtorMode,
			photoUrl: '',
			date: new Date(),
			payers: [],
			debtors: []
		}
	})

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsLoadingAvatar(true)
		const file = event.target.files?.[0]
		if (!file) return

		// Перевірка розміру файлу (5 МБ)
		const maxSize = 5 * 1024 * 1024 // 5MB у байтах
		if (file.size > maxSize) {
			form.setError('photoUrl', {
				type: 'manual',
				message: t('maxFileSizeIs5MB')
			})
			setIsLoadingAvatar(false)
			return
		}

		// Очищаємо помилку, якщо розмір файлу валідний
		form.clearErrors('photoUrl')

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
				form.setValue('photoUrl', data.secure_url, {
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
				form.setError('photoUrl', {
					type: 'manual',
					message: t('errorUploadingPhotoToServer')
				})
				setIsLoadingAvatar(false)
			}
		} catch (error) {
			form.setError('photoUrl', {
				type: 'manual',
				message: t('errorUploadingPhotoToServer')
			})
			setIsLoadingAvatar(false)
		}
	}

	const handleButtonClick = () => {
		// Активуємо прихований input при кліку на прямокутник
		fileInputRef.current?.click()
	}

	const {
		fields: payerFields,
		append: appendPayer,
		remove: removePayer,
		replace: replacePayers
	} = useFieldArray({
		name: 'payers',
		control: form.control,
		rules: {
			validate: payers => {
				// Не валідуємо, поки переклади не завантажені
				if (isLoadingTranslations) {
					return true
				}
				
				const amount = form.getValues('amount')
				const sumOfPayers = payers.reduce(
					(acc, curr) => acc + (parseFloat(curr.amount) || 0),
					0
				)
				return (
					sumOfPayers <= parseFloat(amount) ||
					t('sumOfPayersMustBeLessThanAmount')
				)
			}
		}
	})

	// валідація платників початок

	const isValidatingRef = useRef(false)

	useEffect(() => {
		const subscription = form.watch((values, { name }) => {
			// Перевіряємо чи не валідуємо зараз
			if (isValidatingRef.current) return

			if (name?.startsWith('payers') || name === 'amount') {
				isValidatingRef.current = true

				// Використовуємо setTimeout щоб вийти з поточного call stack
				setTimeout(() => {
					const { payers = [], amount } = values
					if (!amount) return
					const sumOfPayers = payers.reduce(
						(acc, curr) => acc + (parseFloat(curr?.amount!) || 0),
						0
					)

					if (payers.length === 0) {
						// Не встановлюємо помилку, поки переклади не завантажені
						if (!isLoadingTranslations) {
							form.setError('payers', {
								type: 'manual',
								message: t('addAtLeastOnePayer')
							})
						}
					} else if (sumOfPayers < (parseFloat(amount) || 0)) {
						if (!isLoadingTranslations) {
							if (paymentMode === 'single') {
								form.setError('payers', {
									type: 'manual',
									message: t('pleaseReselectPayer')
								})
							} else if (paymentMode === 'multiple') {
								form.setError('payers', {
									type: 'manual',
									message: `${formatBalance(
										parseFloat(amount) - sumOfPayers
									)} ${t('remainOf')} ${amount}`
								})
							}
						}
					} else if (sumOfPayers > (parseFloat(amount) || 0)) {
						if (!isLoadingTranslations) {
							form.setError('payers', {
								type: 'manual',
								message: t('sumOfPayersMustBeLessThanExpenseSum')
							})
						}
					} else {
						form.clearErrors('payers')
					}

					// Звільняємо через невеликий час
					setTimeout(() => {
						isValidatingRef.current = false
					}, 50)
				}, 0)
			}
		})

		return () => subscription.unsubscribe()
	}, [form, expenseFormData, paymentMode, isLoadingTranslations, t])

	const isValidatingDebtorsRef = useRef(false)

	useEffect(() => {
		const subscription = form.watch((values, { name }) => {
			if (isValidatingDebtorsRef.current) return

			if (
				name?.startsWith('debtors') ||
				name === 'amount' ||
				name === 'splitType'
			) {
				isValidatingDebtorsRef.current = true

				setTimeout(() => {
					try {
						if (values === null || values === undefined) return
						const { debtors = [], amount, splitType } = values
						if (!amount || !splitType || !Array.isArray(debtors))
							return

						form.clearErrors('debtors')

						const validDebtors = debtors.filter(
							(
								debtor
							): debtor is {
								userId: string
								amount?: string
								percentage?: string
								shares?: string
								extraAmount?: string
							} =>
								debtor != null &&
								typeof debtor.userId === 'string'
						)

						if (validDebtors.length > 0 || debtors.length === 0) {
							const totalAmount = parseFloat(amount) || 0
							validateDebtorsBySplitType(
								validDebtors,
								totalAmount,
								splitType
							)
						}
					} finally {
						// Завжди скидаємо флаг, навіть якщо сталася помилка
						isValidatingDebtorsRef.current = false
					}
				}, 0)
			}
		})

		return () => subscription.unsubscribe()
	}, [form, expenseFormData, isLoadingTranslations, t])

	const validateDebtorsBySplitType = (
		debtors: TypeAddExpenseForm['debtors'],
		totalAmount: number,
		splitType: 'EQUAL' | 'CUSTOM' | 'PERCENTAGE' | 'SHARES' | 'EXTRA'
	) => {
		switch (splitType) {
			case 'EQUAL':
				validateEqualSplit(debtors)
				break
			case 'CUSTOM':
				validateCustomSplit(debtors, totalAmount)
				break
			case 'PERCENTAGE':
				validatePercentageSplit(debtors)
				break
			case 'SHARES':
				validateSharesSplit(debtors)
				break
			case 'EXTRA':
				validateExtraAmountSplit(debtors, totalAmount)
				break
			default:
				form.clearErrors('debtors')
		}
	}

	const validateEqualSplit = (debtors: TypeAddExpenseForm['debtors']) => {
		// При рівному розподілі просто перевіряємо чи є учасники
		if (debtors.length === 0) {
			// Не встановлюємо помилку, поки переклади не завантажені
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
		} else {
			form.clearErrors('debtors')
		}
	}

	const validateCustomSplit = (
		debtors: TypeAddExpenseForm['debtors'],
		totalAmount: number
	) => {
		const sumOfDebtors = debtors.reduce(
			(acc, curr) => acc + parseFloat(curr.amount || '0'),
			0
		)

		if (debtors.length === 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
		} else if (sumOfDebtors > totalAmount) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('sumOfDebtorsMustBeLessThanExpenseSum')
				})
			}
		} else if (sumOfDebtors < totalAmount && sumOfDebtors >= 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: `${formatBalance(
						totalAmount - sumOfDebtors
					)} ${t('remain')} ${t('of')} ${totalAmount}`
				})
			}
		} else if (sumOfDebtors === totalAmount) {
			form.clearErrors('debtors')
		}
	}

	const validatePercentageSplit = (
		debtors: TypeAddExpenseForm['debtors']
	) => {
		const sumOfPercentages = debtors.reduce(
			(acc, curr) => acc + parseFloat(curr.percentage || '0'),
			0
		)

		if (debtors.length === 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
		} else if (sumOfPercentages > 100) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('sumOfPercentagesCannotExceed100')
				})
			}
		} else if (sumOfPercentages < 100 && sumOfPercentages >= 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: `${formatBalance(100 - sumOfPercentages)}% ${t('remain')}`
				})
			}
		} else if (sumOfPercentages === 100) {
			form.clearErrors('debtors')
		}
	}

	const validateSharesSplit = (debtors: TypeAddExpenseForm['debtors']) => {
		const hasShares = debtors.some(
			debtor => parseFloat(debtor.shares || '0') > 0
		)

		if (debtors.length === 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
		} else if (!hasShares && debtors.length > 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addSharesForAtLeastOneDebtor')
				})
			}
		} else {
			// При розподілі по частках немає фіксованої суми для перевірки
			form.clearErrors('debtors')
		}
	}

	const validateExtraAmountSplit = (
		debtors: TypeAddExpenseForm['debtors'],
		totalAmount: number
	) => {
		if (debtors.length === 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
			return
		}

		// При extraAmount зазвичай є базова сума (рівний розподіл) + додаткові суми
		const sumOfExtraAmounts = debtors.reduce(
			(acc, curr) => acc + parseFloat(curr.extraAmount || '0'),
			0
		)

		// Базова сума розподіляється рівно між усіма
		const baseAmountPerPerson =
			(totalAmount - sumOfExtraAmounts) / debtors.length

		if (debtors.length === 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('addAtLeastOneDebtor')
				})
			}
		} else if (baseAmountPerPerson < 0) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: `${t('extraAmountsExceedTotalExpense')} (${sumOfExtraAmounts.toFixed(
						2
					)}) exceed total expense (${totalAmount})`
				})
			}
		} else if (sumOfExtraAmounts > totalAmount) {
			if (!isLoadingTranslations) {
				form.setError('debtors', {
					type: 'manual',
					message: t('sumOfExtraAmountsMustBeLessThanExpenseSum')
				})
			}
		} else {
			form.clearErrors('debtors')
		}
	}

	// валідація боржників кінець

	const {
		fields: debtorFields,
		append: appendDebtor,
		remove: removeDebtor,
		replace: replaceDebtors
	} = useFieldArray({
		name: 'debtors',
		control: form.control
	})

	const groupMembersLength = group?.members?.length ?? 0
	const allDebtorsSelected =
		debtorMode === 'EQUAL' &&
		groupMembersLength > 0 &&
		debtorFields.length === groupMembersLength &&
		group?.members?.every(member =>
			debtorFields.some(d => d.userId === member.userId)
		)

	// Функція для обробки вибору платника (single mode)
	const handleSinglePayerSelect = (userId: string) => {
		const totalAmount = form.getValues('amount')
		replacePayers([{ userId, amount: totalAmount }])

		setTimeout(() => {
			form.trigger('payers') // або form.trigger() для всієї форми
		}, 50)
	}
	// Функція для обробки множинного вибору (multiple mode)
	const handleMultiplePayerToggle = (userId: string, isChecked: boolean) => {
		const currentPayers = form.getValues('payers')

		if (isChecked) {
			// Додаємо нового платника
			appendPayer({ userId, amount: '' })
		} else {
			// Видаляємо платника
			const updatedPayers = currentPayers.filter(
				payer => payer.userId !== userId
			)
			replacePayers(updatedPayers)
		}

		// setTimeout(() => {
		// 	form.trigger('payers') // або form.trigger() для всієї форми
		// }, 50)
	}

	// Функція для обробки вибору боржників
	const handleDebtorToggle = (userId: string, isChecked: boolean) => {
		const currentDebtors = form.getValues('debtors')

		if (isChecked) {
			// Додаємо нового боржника з базовим об'єктом
			const newDebtor: any = { userId }

			// Додаємо відповідне поле залежно від типу поділу
			switch (debtorMode) {
				case 'CUSTOM':
					newDebtor.amount = ''
					break
				case 'PERCENTAGE':
					newDebtor.percentage = ''
					break
				case 'SHARES':
					newDebtor.shares = ''
					break
				case 'EXTRA':
					newDebtor.extraAmount = ''
					break
				// Для EQUAL не додаємо додаткові поля
			}

			appendDebtor(newDebtor)
		} else {
			// Видаляємо боржника
			const updatedDebtors = currentDebtors.filter(
				debtor => debtor.userId !== userId
			)
			replaceDebtors(updatedDebtors)
		}
	}

	// Обробляємо зміну типу поділу
	const handleSplitTypeChange = (newSplitType: string) => {
		setDebtorMode(
			newSplitType as
				| 'EQUAL'
				| 'CUSTOM'
				| 'PERCENTAGE'
				| 'SHARES'
				| 'EXTRA'
		)
		form.setValue(
			'splitType',
			newSplitType as
				| 'EQUAL'
				| 'CUSTOM'
				| 'PERCENTAGE'
				| 'SHARES'
				| 'EXTRA'
		)
		// Очищаємо масив боржників при зміні типу
		replaceDebtors([])
	}

	// Функція для отримання label та placeholder для інпута
	const getDebtorInputConfig = () => {
		switch (debtorMode) {
			case 'CUSTOM':
				return {
					fieldName: 'amount',
					placeholder: '0.00',
					label: t('amount')
				}
			case 'PERCENTAGE':
				return {
					fieldName: 'percentage',
					placeholder: '0',
					label: t('percentage')
				}
			case 'SHARES':
				return {
					fieldName: 'shares',
					placeholder: '1',
					label: t('shares')
				}
			case 'EXTRA':
				return {
					fieldName: 'extraAmount',
					placeholder: '0.00',
					label: t('extraAmount')
				}
			default:
				return null
		}
	}

	const onSubmit = (data: TypeAddExpenseForm) => {
		// Перевіряємо чи є помилки перед відправкою
		if (
			Object.keys(form.formState.errors).length > 0 ||
			form.getValues('payers').length === 0 ||
			form.getValues('debtors').length === 0
		) {
			return
		}
		const transformedPayers: transformedPayers[] = []
		const transformedDebtors: transformedDebtors[] = []

		switch (paymentMode) {
			case 'single':
			case 'multiple':
				data.payers.forEach(payer => {
					transformedPayers.push({
						...payer,
						amount: payer.amount ? parseFloat(payer.amount) : 0 // Явна перевірка
					})
				})
				break
			default:
				break
		}

		switch (data.splitType) {
			case 'EQUAL':
				data.debtors.forEach(debtor => {
					transformedDebtors.push({
						userId: debtor.userId
					})
				})
				break
			case 'CUSTOM':
				data.debtors.forEach(debtor => {
					transformedDebtors.push({
						userId: debtor.userId,
						amount: debtor.amount ? parseFloat(debtor.amount) : 0
					})
				})
				break
			case 'PERCENTAGE':
				data.debtors.forEach(debtor => {
					transformedDebtors.push({
						userId: debtor.userId,
						percentage: debtor.percentage
							? parseFloat(debtor.percentage)
							: 0
					})
				})
				break
			case 'SHARES':
				data.debtors.forEach(debtor => {
					transformedDebtors.push({
						userId: debtor.userId,
						shares: debtor.shares ? parseFloat(debtor.shares) : 1
					})
				})
				break
			case 'EXTRA':
				data.debtors.forEach(debtor => {
					transformedDebtors.push({
						userId: debtor.userId,
						extraAmount: debtor.extraAmount
							? parseFloat(debtor.extraAmount)
							: 0
					})
				})
				break
			default:
				break
		}

		const transformedData: TypeAddExpenseFormNumber = {
			...data,
			amount: parseFloat(data.amount || '0'), // Конвертуємо amount у число
			payers: transformedPayers,
			debtors: transformedDebtors
		}

		if (edit) {
			editExpense({ data: transformedData, expenseId })
		} else {
			addExpense(transformedData)
		}
	}

	if (isLoadingGroup) {
		return <div>{t('loadingGroupMembers')}</div>
	}

	if (!group?.members?.length) {
		return <div>{t('noGroupMembersFound')}</div>
	}

	const inputConfig = getDebtorInputConfig()

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid gap-4 w-full max-w-[400px] mt-24 mb-18'
			>
				<BackButton url={`/groups/${groupId}`} />
				<Card className=''>
					<CardHeader>
						<CardTitle>
							{edit ? t('editExpense') : t('createExpense')}
						</CardTitle>
					</CardHeader>
					{/* form fields */}
					<CardContent>
						{/* description */}
						<FormField
							control={form.control}
							name='description'
							disabled={
								isLoadingAddExpense || isLoadingEditExpense
							}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('expenseName')}</FormLabel>
									<FormControl>
										<Input
											placeholder={t('enterExpenseName')}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* amount */}
						<FormField
							control={form.control}
							name='amount'
							disabled={
								isLoadingAddExpense || isLoadingEditExpense
							}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('expenseSum')}</FormLabel>
									<FormControl>
										<Input type='number' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* photo Url*/}
						<FormField
							control={form.control}
							name='photoUrl'
							disabled={
								isLoadingAddExpense ||
								isLoadingEditExpense ||
								isLoadingAvatar
							}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('expensePic')}</FormLabel>
									<FormControl>
										<div>
											{/* Кастомний прямокутник */}
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

												{previewUrl ? (
													<div className='mt-2'>
														<a
															href={
																originalUrl ||
																'#'
															}
															target='_blank'
															rel='noopener noreferrer'
															title={t('openOriginalImage')}
														>
															<img
																src={previewUrl}
																alt={t('avatarPreview')}
																className='h-24 w-24 min-w-24 object-cover block rounded-full hover:opacity-80 transition-opacity'
															/>
														</a>
													</div>
												) : (
													<div className='h-24 w-24 flex-shrink-0  leading-24 text-center rounded-full hover:opacity-80 transition-opacity bg-muted-foreground/10'>
														{form
															.getValues(
																'description'
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
												disabled={isLoadingAddExpense}
												onChange={handleFileChange}
											/>
											<input type='hidden' {...field} />
											{/* Попередній перегляд */}
										</div>
									</FormControl>
									{form.formState.errors.photoUrl && (
										<div className='text-red-500 text-sm mt-2 text-center'>
											{
												form.formState.errors.photoUrl
													.message
											}
										</div>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* split type */}
						<FormField
							control={form.control}
							name='splitType'
							disabled={
								isLoadingAddExpense || isLoadingEditExpense
							}
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>{t('splitType')}</FormLabel>
									<FormControl className='w-full'>
										<Select
											onValueChange={
												handleSplitTypeChange
											}
											value={field.value}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder={t('selectSplitType')} />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='EQUAL'>
													{t('equal')}
												</SelectItem>
												<SelectItem value='CUSTOM'>
													{t('custom')}
												</SelectItem>
												<SelectItem value='PERCENTAGE'>
													{t('percentage')}
												</SelectItem>
												<SelectItem value='SHARES'>
													{t('shares')}
												</SelectItem>
												<SelectItem value='EXTRA'>
													{t('extra')}
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* date */}
						<FormField
							control={form.control}
							name='date'
							disabled={
								isLoadingAddExpense || isLoadingEditExpense
							}
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>{t('dateOfExpense')}</FormLabel>
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
														formatDate(field.value, 'PP', user?.language || Language.EN)
													) : (
														<span>{t('pickDate')}</span>
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
														new Date('2000-01-01')
												}
												initialFocus
												language={user?.language || Language.EN}
											/>
										</PopoverContent>
									</Popover>

									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Card className=''>
					<CardHeader>
						<CardTitle>{t('choosePayer')}</CardTitle>
					</CardHeader>
					<CardContent>
						<FormItem>
							{/* <FormLabel>{t('paymentMode')}</FormLabel> */}
							<FormControl>
								<div className='flex p-1 bg-muted rounded-lg mb-4'>
									<button
										type='button'
										onClick={() => {
											setPaymentMode('single')
											replacePayers([])
										}}
										className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
											paymentMode === 'single'
												? 'bg-primary shadow-sm text-background'
												: 'text-muted-foreground hover:text-foreground'
										}`}
									>
										{t('singlePayer')}
									</button>
									<button
										type='button'
										onClick={() => {
											setPaymentMode('multiple')
											replacePayers([])
										}}
										className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
											paymentMode === 'multiple'
												? 'bg-primary shadow-sm text-background'
												: 'text-muted-foreground hover:text-foreground'
										}`}
									>
										{t('multiplePayers')}
									</button>
								</div>
							</FormControl>
						</FormItem>

						{/* Вибір платників */}
						<FormItem>
							<FormControl>
								{paymentMode === 'single' ? (
									<RadioGroup
										value={payerFields[0]?.userId || '12'}
										onValueChange={handleSinglePayerSelect}
										className='grid gap-3'
									>
										{group.members.map(member => (
											<div
												key={member.userId}
												className='flex items-center space-x-2'
											>
												<RadioGroupItem
													value={member.userId}
													id={`payer-${member.userId}`}
												/>
												<label
													htmlFor={`payer-${member.userId}`}
													className='flex-1 cursor-pointer flex items-center gap-2'
												>
													<Avatar>
														<AvatarImage
															src={
																member.user
																	.picture
															}
														/>
														<AvatarFallback>
															{member.user.displayName
																.slice(0, 2)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													{member.user.displayName}
												</label>
											</div>
										))}
									</RadioGroup>
								) : (
									<div className='grid gap-3'>
										{group.members.map(member => {
											const fieldIndex =
												payerFields.findIndex(
													f =>
														f.userId ===
														member.userId
												)
											const isSelected = fieldIndex !== -1

											return (
												<div
													key={member.userId}
													className='flex items-center space-x-3'
												>
													<Checkbox
														id={`payer-${member.userId}`}
														checked={isSelected}
														onCheckedChange={checked =>
															handleMultiplePayerToggle(
																member.userId,
																!!checked
															)
														}
													/>
													<label
														htmlFor={`payer-${member.userId}`}
														className='min-w-0 flex-1 cursor-pointer flex items-center gap-2'
													>
														<Avatar>
															<AvatarImage
																src={
																	member.user
																		.picture
																}
															/>
															<AvatarFallback>
																{member.user.displayName
																	.slice(0, 2)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														{
															member.user
																.displayName
														}
													</label>

													{/* Інпут з'являється тільки коли чекбокс обраний */}
													{isSelected && (
														<FormField
															control={
																form.control
															}
															disabled={
																isLoadingAddExpense
															}
															name={`payers.${fieldIndex}.amount`}
															render={({
																field: amountField
															}) => (
																<FormItem className='mb-0'>
																	<FormControl>
																		<Input
																			type='number'
																			min={
																				0
																			}
																			placeholder='0.00'
																			className='w-24'
																			{...amountField}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													)}
												</div>
											)
										})}
									</div>
								)}
							</FormControl>
							{form.formState.errors.payers && (
								<div className='text-red-500 text-sm mt-2 text-center'>
									{form.formState.errors.payers.message}
								</div>
							)}
							<FormMessage />
						</FormItem>
					</CardContent>
				</Card>

				<Card className=''>
					<CardHeader className=''>
						<div className='flex items-center justify-between'>
							<CardTitle>{t('chooseDebtor')}</CardTitle>
							{debtorMode === 'EQUAL' && (
								<button
									type='button'
									className='cursor-pointer px-2 rounded-full bg-primary text-background hover:bg-primary/90 transition-colors w-fit'
									onClick={() => {
										if (allDebtorsSelected) {
											replaceDebtors([])
										} else {
											const allDebtors =
												group.members.map(member => ({
													userId: member.userId
												}))
											replaceDebtors(allDebtors)
										}
									}}
								>
									{allDebtorsSelected
										? t('clearAll')
										: t('chooseAll')}
								</button>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{/* Вибір боржників */}
						<FormItem>
							<FormControl>
								<div className='grid gap-3'>
									{/* Додаємо кнопку "Вибрати всіх" тільки для EQUAL */}

									{group.members.map(member => {
										const fieldIndex =
											debtorFields.findIndex(
												f => f.userId === member.userId
											)
										const isSelected = fieldIndex !== -1

										// Використовуємо watch для реактивного оновлення
										const totalAmount = parseFloat(form.watch('amount') || '0')
										const selectedDebtorsCount = debtorFields.length

										let calculatedShare = 0

										// Для EXTRA режиму рахуємо завжди (навіть якщо не вибрано)
										if (debtorMode === 'EXTRA') {
											const allExtraDebtors = form.watch('debtors') || []
											// 1. Сумуємо всі додаткові суми
											const totalExtraAmounts = allExtraDebtors.reduce((sum: number, d: any) => sum + parseFloat(d.extraAmount || '0'), 0)
											// 2. Віднімаємо від загальної суми
											const remainingAmount = totalAmount - totalExtraAmounts
											// 3. Ділимо залишок на ВСІХ членів групи (не тільки вибраних!)
											const totalMembersCount = group.members.length
											const baseShare = totalMembersCount > 0 ? remainingAmount / totalMembersCount : 0

											// 4. Отримуємо додаткову суму користувача (якщо вибраний)
											const userExtraAmount = isSelected ? parseFloat(form.watch(`debtors.${fieldIndex}.extraAmount`) || '0') : 0

											// 5. Фінальна сума = базова частка + додаткова сума
											calculatedShare = baseShare + userExtraAmount
										} else if (isSelected) {
											// Для інших режимів рахуємо тільки якщо вибрано
											switch (debtorMode) {
												case 'EQUAL':
													calculatedShare = selectedDebtorsCount > 0 ? totalAmount / selectedDebtorsCount : 0
													break
												case 'PERCENTAGE':
													const percentage = parseFloat(form.watch(`debtors.${fieldIndex}.percentage`) || '0')
													calculatedShare = totalAmount * (percentage / 100)
													break
												case 'SHARES':
													// Потрібно отримати всі частки з watch
													const allDebtors = form.watch('debtors') || []
													const totalShares = allDebtors.reduce((sum: number, d: any) => sum + parseFloat(d.shares || '0'), 0)
													const userShares = parseFloat(form.watch(`debtors.${fieldIndex}.shares`) || '0')
													calculatedShare = totalShares > 0 ? totalAmount * (userShares / totalShares) : 0
													break
											}
										}

										return (
											<div
												key={member.userId}
												className='flex items-center space-x-3'
											>
												<Checkbox
													id={`debtor-${member.userId}`}
													checked={isSelected}
													onCheckedChange={checked =>
														handleDebtorToggle(
															member.userId,
															!!checked
														)
													}
												/>
												<label
													htmlFor={`debtor-${member.userId}`}
													className='min-w-0 flex-1 cursor-pointer flex items-center gap-2'
												>
													<Avatar>
														<AvatarImage
															src={
																member.user
																	.picture
															}
														/>
														<AvatarFallback>
															{member.user.displayName
																.slice(0, 2)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													{member.user.displayName}
												</label>

												{/* Відображення розрахованої частки для EQUAL */}
												{isSelected && debtorMode === 'EQUAL' && (
													<span className='text-sm font-medium text-muted-foreground w-24 text-right'>
														{formatBalance(calculatedShare)}
													</span>
												)}

												{/* Відображення для EXTRA режиму - показуємо ЗАВЖДИ (навіть якщо не вибрано) */}
												{!isSelected && debtorMode === 'EXTRA' && (
													<span className='text-sm font-medium text-muted-foreground w-24 text-right'>
														{formatBalance(calculatedShare)}
													</span>
												)}

												{/* Інпут з'являється тільки коли потрібно (не для EQUAL) та чекбокс обраний */}
												{isSelected && inputConfig && (
													<>
														{/* Відображення розрахованої суми ПЕРЕД інпутом (не для CUSTOM) */}
														{debtorMode !== 'CUSTOM' && (
															<span className='text-sm font-medium text-muted-foreground w-24 text-right mr-[15px]'>
																{formatBalance(calculatedShare)}
															</span>
														)}
														<FormField
															control={form.control}
															disabled={
																isLoadingAddExpense
															}
															name={
																`debtors.${fieldIndex}.${inputConfig.fieldName}` as any
															}
															render={({
																field: inputField
															}) => (
																<FormItem className='mb-0'>
																	<FormControl>
																		<Input
																			type='number'
																			min={0}
																			placeholder={
																				inputConfig.placeholder
																			}
																			className='w-24'
																			{...inputField}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</>
												)}
											</div>
										)
									})}
								</div>
							</FormControl>
							{form.formState.errors.debtors && (
								<div className='text-red-500 text-sm mt-2 text-center'>
									{form.formState.errors.debtors.message}
								</div>
							)}
							<FormMessage />
						</FormItem>
					</CardContent>
				</Card>

				<Button
					type='submit'
					disabled={
						Object.keys(form.formState.errors).length > 0 ||
						isLoadingAddExpense ||
						form.getValues('payers').length === 0 ||
						form.getValues('debtors').length === 0
					}
				>
					{edit ? t('editExpense') : t('createExpense')}
				</Button>
			</form>
		</Form>
	)
}

export default AddExpenseForm
