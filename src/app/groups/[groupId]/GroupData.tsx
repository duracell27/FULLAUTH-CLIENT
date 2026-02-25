'use client'
import { useGroup, useProfile, useTranslations } from '@/shared/hooks'
import { Loading } from '@/shared/componets/ui/Loading'
import { Button } from '@/shared/componets/ui'
import { GroupInfoCard } from './GroupInfoCard'
import { PaymentsCard } from './PaymentsCard'
import { BalancesCard } from './BalancesCard'
import { ExpensesCard } from './ExpensesCard'
import { MembersCard } from './MembersCard'

type Props = {
	groupId: string
}

export const GroupData = ({ groupId }: Props) => {
	const { group, isLoadingGroup, isErrorGroup, refetchGroup } = useGroup(groupId)
	const { user } = useProfile()
	const { t } = useTranslations()

	if (isLoadingGroup) {
		return <Loading />
	}

	if (isErrorGroup) {
		return (
			<div className='flex flex-col items-center justify-center py-10 gap-3'>
				<p className='text-muted-foreground'>{t('errorLoadingGroup')}</p>
				<Button onClick={() => refetchGroup()}>{t('tryAgain')}</Button>
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
		</div>
	)
}
