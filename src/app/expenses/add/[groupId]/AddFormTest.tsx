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
	Checkbox
} from '@/shared/componets/ui'
import { useGroup } from '@/shared/hooks'
import { addExpenseSchema, TypeAddExpenseForm } from '@/shared/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

type Props = {
	groupId: string
}

const AddExpenseForm = ({ groupId }: Props) => {
	const { group, isLoadingGroup } = useGroup(groupId)
	const [paymentMode, setPaymentMode] = useState<'single' | 'multiple'>(
		'single'
	)
	const [debtorMode, setDebtorMode] = useState<
		'EQUAL' | 'CUSTOM' | 'PERCENTAGE' | 'SHARES' | 'EXTRA'
	>('EQUAL')

	const form = useForm<TypeAddExpenseForm>({
		resolver: zodResolver(addExpenseSchema),
		defaultValues: {
			description: 'test',
			amount: '200',
			groupId,
			splitType: debtorMode,
			photoUrl: '',
			payers: [],
			debtors: []
		}
	})

	const {
		fields: payerFields,
		append: appendPayer,
		remove: removePayer,
		replace: replacePayers
	} = useFieldArray({
		name: 'payers',
		control: form.control
	})

	const {
		fields: debtorFields,
		append: appendDebtor,
		remove: removeDebtor,
		replace: replaceDebtors
	} = useFieldArray({
		name: 'debtors',
		control: form.control
	})

	// Функція для обробки вибору платника (single mode)
	const handleSinglePayerSelect = (userId: string) => {
		const totalAmount = form.getValues('amount')
		replacePayers([{ userId, amount: totalAmount }])
	}

	// Функція для обробки множинного вибору (multiple mode)
	const handleMultiplePayerToggle = (userId: string, isChecked: boolean) => {
		const currentPayers = form.getValues('payers')

		if (isChecked) {
			// Додаємо нового платника
			appendPayer({ userId, amount: '0' })
		} else {
			// Видаляємо платника
			const updatedPayers = currentPayers.filter(
				payer => payer.userId !== userId
			)
			replacePayers(updatedPayers)
		}
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
					newDebtor.amount = '0'
					break
				case 'PERCENTAGE':
					newDebtor.percentage = '0'
					break
				case 'SHARES':
					newDebtor.shares = '0'
					break
				case 'EXTRA':
					newDebtor.extraAmount = '0'
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

	// Перевіряємо чи обраний користувач як платник
	const isUserSelected = (userId: string) => {
		return payerFields.some(field => field.userId === userId)
	}

	// Перевіряємо чи обраний користувач як боржник
	const isDebtorSelected = (userId: string) => {
		return debtorFields.some(field => field.userId === userId)
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
					label: 'Amount'
				}
			case 'PERCENTAGE':
				return {
					fieldName: 'percentage',
					placeholder: '0',
					label: 'Percentage'
				}
			case 'SHARES':
				return {
					fieldName: 'shares',
					placeholder: '1',
					label: 'Shares'
				}
			case 'EXTRA':
				return {
					fieldName: 'extraAmount',
					placeholder: '0.00',
					label: 'Extra Amount'
				}
			default:
				return null
		}
	}

	const onSubmit = (data: TypeAddExpenseForm) => {
		console.log('Transformed data:', data)
	}

	if (isLoadingGroup) {
		return <div>Loading group members...</div>
	}

	if (!group?.members?.length) {
		return <div>No group members found</div>
	}

	const inputConfig = getDebtorInputConfig()

	return (
		<Card className='w-full max-w-[400px] mt-18'>
			<CardHeader>
				<CardTitle>Create expense</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='grid gap-4'
					>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expense name</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter expense name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expense sum</FormLabel>
									<FormControl>
										<Input type='number' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='photoUrl'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expense pic</FormLabel>
									<FormControl>
										<Input type='file' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='splitType'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Split type</FormLabel>
									<FormControl className='w-full'>
										<Select
											onValueChange={
												handleSplitTypeChange
											}
											defaultValue={field.value}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select split type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='EQUAL'>
													Equal
												</SelectItem>
												<SelectItem value='CUSTOM'>
													Custom
												</SelectItem>
												<SelectItem value='PERCENTAGE'>
													Percentage
												</SelectItem>
												<SelectItem value='SHARES'>
													Shares
												</SelectItem>
												<SelectItem value='EXTRA'>
													Extra
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Вибір режиму оплати */}
						<FormItem>
							<FormLabel>Payment mode</FormLabel>
							<FormControl>
								<RadioGroup
									value={paymentMode}
									onValueChange={(
										value: 'single' | 'multiple'
									) => {
										setPaymentMode(value)
										// Очищаємо payers при зміні режиму
										replacePayers([])
									}}
									className='flex flex-row space-x-4'
								>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem
											value='single'
											id='single'
										/>
										<label htmlFor='single'>
											Single payer
										</label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem
											value='multiple'
											id='multiple'
										/>
										<label htmlFor='multiple'>
											Multiple payers
										</label>
									</div>
								</RadioGroup>
							</FormControl>
						</FormItem>

						{/* Вибір платників */}
						<FormItem>
							<FormLabel>Who paid?</FormLabel>
							<FormControl>
								{paymentMode === 'single' ? (
									<RadioGroup
										value={payerFields[0]?.userId || ''}
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
													className='flex-1 cursor-pointer'
												>
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
														className='min-w-0 flex-1 cursor-pointer'
													>
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
															name={`payers.${fieldIndex}.amount`}
															render={({
																field: amountField
															}) => (
																<FormItem className='mb-0'>
																	<FormControl>
																		<Input
																			type='number'
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
							<FormMessage />
						</FormItem>

						{/* Вибір боржників */}
						<FormItem>
							<FormLabel>Who owes?</FormLabel>
							<FormControl>
								<div className='grid gap-3'>
									{group.members.map(member => {
										const fieldIndex =
											debtorFields.findIndex(
												f => f.userId === member.userId
											)
										const isSelected = fieldIndex !== -1

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
													className='min-w-0 flex-1 cursor-pointer'
												>
													{member.user.displayName}
												</label>

												{/* Інпут з'являється тільки коли потрібно (не для EQUAL) та чекбокс обраний */}
												{isSelected && inputConfig && (
													<FormField
														control={form.control}
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
												)}
											</div>
										)
									})}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>

						<Button type='submit'>Create expense</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export default AddExpenseForm
