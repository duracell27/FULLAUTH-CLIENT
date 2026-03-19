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
import { useCardRequestsSent, useFriends, useProfile, useSendCardRequestMutation, useTranslations } from '@/shared/hooks'
import {
	addPaymentSchema,
	TypeAddPaymentSchema
} from '@/shared/schemas/createPayment.schema'
import { round2 } from '@/shared/utils/formatBalance'
import { CardVisibility } from '@/shared/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, Copy, Eye, EyeOff, HandCoins, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
	amount: number
	groupId: string
	creditor: {
		id: string
		displayName: string
		picture: string | null
		cardNumber: string | null
		cardVisibility: CardVisibility
	}
	debtor: { id: string; displayName: string; picture: string | null }
	closeDialog: () => void
}

export const PaymentForm = ({ amount, groupId, creditor, debtor, closeDialog }: Props) => {
	const { addPayment, isLoadingAddPayment } = useAddPaymentMutation(groupId)
	const { t } = useTranslations()
	const { friendsData } = useFriends()
	const { user: currentUser } = useProfile()
	const { sentRequests } = useCardRequestsSent()
	const { sendCardRequest, isSendingCardRequest } = useSendCardRequestMutation()
	const [cardRevealed, setCardRevealed] = useState(false)

	const isCurrentUserCreditor = currentUser?.id === creditor.id
	const isCreditorFriend = friendsData?.friends.some(
		f => f.sender.id === creditor.id || f.receiver.id === creditor.id
	)

	const sentRequest = sentRequests?.find(r => r.targetId === creditor.id)
	const isApprovedRequest = sentRequest?.status === 'APPROVED'
	const isPendingRequest = sentRequest?.status === 'PENDING'

	const showCardBlock =
		creditor.cardNumber &&
		(isCurrentUserCreditor ||
			creditor.cardVisibility === CardVisibility.EVERYONE ||
			(creditor.cardVisibility === CardVisibility.ON_REQUEST && (isCurrentUserCreditor || isApprovedRequest || isPendingRequest || true)) ||
			(creditor.cardVisibility === CardVisibility.FRIENDS_ONLY && isCreditorFriend))

	const maskedCard = creditor.cardNumber
		? (creditor.cardVisibility === CardVisibility.ON_REQUEST && !isCurrentUserCreditor && !isApprovedRequest)
			? '**** **** **** ****'
			: '**** **** **** ' + creditor.cardNumber.replace(/\s/g, '').slice(-4)
		: ''

	const handleCopy = () => {
		if (creditor.cardNumber) {
			navigator.clipboard.writeText(creditor.cardNumber)
			toast.success(t('cardCopied'))
		}
	}

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

					<div className='flex items-center gap-2 py-2 my-1 border-t border-primary/30'>
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

					{showCardBlock && (
						<div className='w-full flex items-center gap-1'>
							<div className='flex-1 flex items-center px-3 py-2 rounded-lg border bg-muted/40 border-primary/30'>
								<span className='font-mono text-sm'>
									{(creditor.cardVisibility === CardVisibility.ON_REQUEST && !isCurrentUserCreditor && !isApprovedRequest) || !cardRevealed
										? maskedCard
										: creditor.cardNumber}
								</span>
							</div>

							{creditor.cardVisibility === CardVisibility.ON_REQUEST && !isCurrentUserCreditor && !isApprovedRequest ? (
								<>
									<button
										type='button'
										className='w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border border-primary/30 bg-muted/40 text-muted-foreground'
									>
										<Lock className='size-4' />
									</button>
									{isPendingRequest ? (
										<span className='text-xs text-muted-foreground px-2'>
											{t('cardRequestPending')}
										</span>
									) : (
										<Button
											type='button'
											size='xs'
											className='text-xs self-stretch h-auto px-3'
											disabled={isSendingCardRequest}
											onClick={() => sendCardRequest(creditor.id)}
										>
											{t('getCardNumber')}
										</Button>
									)}
								</>
							) : (
								<>
									<button
										type='button'
										onClick={() => setCardRevealed(v => !v)}
										className='w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border border-primary/30 bg-muted/40 text-muted-foreground hover:text-foreground transition-colors'
									>
										{cardRevealed ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
									</button>
									<button
										type='button'
										onClick={handleCopy}
										className='w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
									>
										<Copy className='size-4' />
									</button>
								</>
							)}
						</div>
					)}

					<Button disabled={isLoadingAddPayment} type='submit' className='mt-1'>
						{t('createPayment')}
					</Button>
				</form>
			</Form>
		</div>
	)
}
