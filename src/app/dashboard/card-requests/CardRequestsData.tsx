'use client'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui'
import { Loading } from '@/shared/componets/ui/Loading'
import {
	useCardRequestsReceived,
	useRevokeCardRequestMutation,
	useTranslations,
	useUpdateCardRequestMutation
} from '@/shared/hooks'
import { useProfile } from '@/shared/hooks/useProfile'
import { Language } from '@/shared/types/user.types'
import { formatDate } from '@/shared/utils'
import { Check, CreditCard, Trash2, X } from 'lucide-react'

export const CardRequestsData = () => {
	const { t } = useTranslations()
	const { user } = useProfile()
	const { receivedRequests, isLoadingReceivedRequests } = useCardRequestsReceived()
	const { updateCardRequest, isUpdatingCardRequest } = useUpdateCardRequestMutation()
	const { revokeCardRequest, isRevokingCardRequest } = useRevokeCardRequestMutation()

	if (isLoadingReceivedRequests) return <Loading />

	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<CardTitle>{t('cardRequests')}</CardTitle>
			</CardHeader>
			<CardContent>
				{!receivedRequests || receivedRequests.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground'>
						<CreditCard className='size-10' />
						<p className='text-sm'>{t('noCardRequests')}</p>
					</div>
				) : (
					<ul className='flex flex-col gap-2'>
						{receivedRequests.map(req => (
							<li
								key={req.id}
								className='flex items-center gap-3 border rounded-xl px-3 py-2'
							>
								<Avatar className='shrink-0'>
									<AvatarImage
										src={
											req.requester.picture
												? req.requester.picture.replace(
														'/upload/',
														'/upload/w_100,h_100,c_fill,f_webp,q_80/'
												  )
												: ''
										}
									/>
									<AvatarFallback>
										{req.requester.displayName.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium truncate'>
										{req.requester.displayName}
									</p>
									<p className='text-xs text-muted-foreground'>
										{formatDate(req.createdAt, 'dd.MM.yyyy', user?.language || Language.EN)}
									</p>
								</div>

								<div className='flex items-center gap-2 shrink-0'>
									{req.status === 'PENDING' ? (
										<>
											<Button
												size='icon'
												className='w-8 h-8'
												disabled={isUpdatingCardRequest}
												onClick={() => updateCardRequest({ id: req.id, status: 'APPROVED' })}
												title={t('cardRequestApprove')}
											>
												<Check className='size-4' />
											</Button>
											<Button
												size='icon'
												className='w-8 h-8 text-bad-red border-bad-red hover:bg-bad-red/10 hover:text-bad-red'
												variant='outline'
												disabled={isUpdatingCardRequest}
												onClick={() => updateCardRequest({ id: req.id, status: 'DENIED' })}
												title={t('cardRequestDeny')}
											>
												<X className='size-4' />
											</Button>
										</>
									) : req.status === 'APPROVED' ? (
										<>
											<Button
												size='xs'
												variant='outline'
												className='text-good-green border-good-green hover:bg-good-green/10 hover:text-good-green pointer-events-none'
												tabIndex={-1}
											>
												{t('cardRequestApproved')}
											</Button>
											<Button
												size='icon'
												className='w-8 h-8 text-bad-red border-bad-red hover:bg-bad-red/10 hover:text-bad-red'
												variant='outline'
												disabled={isRevokingCardRequest}
												onClick={() => revokeCardRequest(req.id)}
												title={t('cardRequestRevoke')}
											>
												<Trash2 className='size-4' />
											</Button>
										</>
									) : (
										<Button
											size='xs'
											variant='outline'
											className='text-muted-foreground pointer-events-none'
											tabIndex={-1}
										>
											{t('cardRequestDenied')}
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}
