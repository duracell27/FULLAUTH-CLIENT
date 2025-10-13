'use client'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Input
} from '@/shared/componets/ui'
import { useAddPaymentMutation } from '@/shared/hooks/useAddPaymentMutation'
import { useTranslations } from '@/shared/hooks'
import {
	addPaymentSchema,
	TypeAddPaymentSchema
} from '@/shared/schemas/createPayment.schema'
import { round2 } from '@/shared/utils/formatBalance'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, HandCoins } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

type Props = {
	amount: number
	groupId: string
	creditor: { id: string; displayName: string; picture: string | null }
	debtor: { id: string; displayName: string; picture: string | null }
	closeDialog: () => void
}

export const PaymentForm = ({ amount, groupId, creditor, debtor, closeDialog }: Props) => {
	const { addPayment, isLoadingAddPayment } = useAddPaymentMutation(groupId)
	const { t } = useTranslations()

	const form = useForm<TypeAddPaymentSchema>({
		resolver: zodResolver(addPaymentSchema),
		defaultValues: {
			amount: round2(amount) || 1,
			groupId: groupId,
			creditorId: creditor.id,
			debtorId: debtor.id
		}
	})

	const onSubmit = (data: TypeAddPaymentSchema) => {
		addPayment(data)
		closeDialog()
	}

	return (
		<div className='flex flex-col items-center gap-2'>
			<div className='flex items-center gap-2 py-3 border-y border-primary/30'>
				<Avatar className='cursor-pointer mb-0'>
					<AvatarImage
						src={
							debtor.picture
								? debtor.picture.replace(
										'/upload/',
										'/upload/w_100,h_100,c_fill,f_webp,q_80/'
								  )
								: ''
						}
					/>
					<AvatarFallback className='text-base'>
						{debtor.displayName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<p>
					{debtor.displayName}{' '}
					<span className='font-bold'>{t('returns')}</span>
				</p>
			</div>
			<div className='flex items-center gap-2'>
				<HandCoins className='text-primary' />
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-2 flex flex-col items-center'
				>
					<FormField
						control={form.control}
						name='amount'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='w-[110px]'
										placeholder={t('sumOfPayment')}
										type='number'
										disabled={isLoadingAddPayment}
										{...field}
										onChange={e =>
											field.onChange(
												e.target.valueAsNumber
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<ArrowDown className='text-primary' />

					<div className='flex items-center gap-2 py-2 mb-3 my-1 border-y border-primary/30'>
						<p>
							<span className='font-bold'>{t('to')}</span>{' '}
						</p>
						<Avatar className='cursor-pointer mb-0'>
							<AvatarImage
								src={
									creditor.picture
										? creditor.picture.replace(
												'/upload/',
												'/upload/w_100,h_100,c_fill,f_webp,q_80/'
										  )
										: ''
								}
							/>
							<AvatarFallback className='text-base'>
								{creditor.displayName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<p>{creditor.displayName}</p>
					</div>

					<Button disabled={isLoadingAddPayment} type='submit'>
						{t('createPayment')}
					</Button>
				</form>
			</Form>
		</div>
	)
}
