'use client'
import { useGroup, useProfile, useTranslations } from '@/shared/hooks'
import { Loading } from '@/shared/componets/ui/Loading'
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/componets/ui'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { GroupInfoCard } from './GroupInfoCard'
import { PaymentsCard } from './PaymentsCard'
import { BalancesCard } from './BalancesCard'
import { ExpensesCard } from './ExpensesCard'
import { MembersCard } from './MembersCard'
import { useGroupsRequests } from '@/shared/hooks/useGroupsRequests'
import { GroupShareCard } from '../GroupShareCard'
import { useAcceptGroupRequestMutation } from '@/shared/hooks/useAcceptGroupRequestMutation'
import { useRejectGroupRequestMutation } from '@/shared/hooks/useRejectGroupRequestMutation'
import { getAvatarUrl, formatDate } from '@/shared/utils'
import { Language } from '@/shared/types/user.types'
import { Check, X } from 'lucide-react'

type Props = {
	groupId: string
}

export const GroupData = ({ groupId }: Props) => {
	const { group, isLoadingGroup, isErrorGroup, refetchGroup } = useGroup(groupId)
	const { user } = useProfile()
	const { t } = useTranslations()
	const { userGroupsRequests } = useGroupsRequests()
	const { acceptGroupRequest } = useAcceptGroupRequestMutation()
	const { rejectGroupRequest } = useRejectGroupRequestMutation()

	const language = user?.language || Language.EN
	const router = useRouter()

	useEffect(() => {
		if (isErrorGroup) {
			router.replace(`/groups/${groupId}/public`)
		}
	}, [isErrorGroup, groupId, router])

	if (isLoadingGroup) {
		return <Loading />
	}

	if (isErrorGroup) {
		return (
			<div className='w-full max-w-[400px] flex flex-col gap-3 py-10'>
				<div className='flex flex-col items-center gap-3'>
					<p className='text-muted-foreground'>{t('errorLoadingGroup')}</p>
					<Button onClick={() => refetchGroup()}>{t('tryAgain')}</Button>
				</div>

				{userGroupsRequests && userGroupsRequests.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>{t('groupRequests')}</CardTitle>
						</CardHeader>
						<CardContent>
							<ul>
								{userGroupsRequests.map(req => (
									<li key={req.id}>
										<div className='border-t border-b border-ring/20 py-2 flex gap-2 items-center'>
											<Avatar>
												<AvatarImage src={getAvatarUrl(req.avatarUrl)} />
												<AvatarFallback>
													{req.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className='flex-1'>
												<h2 className='font-bold'>{req.name}</h2>
												<span className='text-xs'>
													{formatDate(req.eventDate, 'PP', language)}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												<Button onClick={() => acceptGroupRequest(req.id)}>
													<Check />
												</Button>
												<Button variant='outline' onClick={() => rejectGroupRequest(req.id)}>
													<X />
												</Button>
											</div>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				)}
			</div>
		)
	}

	if (!group || !user) {
		return <div>{t('groupNotFound')}</div>
	}

	return (
		<div className='w-full max-w-[400px] flex flex-col gap-3 pb-18'>
			<GroupInfoCard group={group} user={user} />
			<PaymentsCard group={group} user={user} />
			<BalancesCard group={group} user={user} />
			<ExpensesCard group={group} user={user} />
			<MembersCard group={group} user={user} />
			{group.isPublic && <GroupShareCard groupId={group.id} />}
		</div>
	)
}
