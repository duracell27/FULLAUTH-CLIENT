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
import { usePublicGroup, useJoinGroupRequestMutation, useTranslations } from '@/shared/hooks'
import { useProfile } from '@/shared/hooks/useProfile'
import { Language } from '@/shared/types/user.types'
import { formatDate, getAvatarUrl } from '@/shared/utils'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
	groupId: string
}

export const PublicGroupData = ({ groupId }: Props) => {
	const { publicGroup, isLoadingPublicGroup, isErrorPublicGroup } = usePublicGroup(groupId)
	const { sendJoinRequest, isSendingJoinRequest } = useJoinGroupRequestMutation(groupId)
	const { t } = useTranslations()
	const { user } = useProfile()
	const router = useRouter()

	const language = user?.language || Language.EN

	useEffect(() => {
		if (publicGroup?.currentUserStatus === 'ACCEPTED') {
			router.replace(`/groups/${groupId}`)
		}
	}, [publicGroup, groupId, router])

	if (isLoadingPublicGroup) return <Loading />

	if (isErrorPublicGroup || !publicGroup) {
		return (
			<Card className='w-full max-w-[400px]'>
				<CardContent className='py-10 text-center text-muted-foreground'>
					{t('groupNotFound')}
				</CardContent>
			</Card>
		)
	}

	if (!publicGroup.isPublic) {
		return (
			<Card className='w-full max-w-[400px]'>
				<CardContent className='py-10 text-center text-muted-foreground'>
					{t('groupPrivate')}
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full max-w-[400px]'>
			<CardHeader>
				<div className='flex items-center gap-3'>
					<Avatar className='size-14'>
						<AvatarImage src={getAvatarUrl(publicGroup.avatarUrl)} />
						<AvatarFallback className='text-lg'>
							{publicGroup.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>{publicGroup.name}</CardTitle>
						<p className='text-sm text-muted-foreground'>
							{formatDate(publicGroup.createdAt, 'PP', language)}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<Users className='size-4' />
					<span>
						{publicGroup.membersCount} {t('members')}
						{publicGroup.maxMembers ? ` / ${publicGroup.maxMembers}` : ''}
					</span>
				</div>

				{publicGroup.showMembers && publicGroup.members && publicGroup.members.length > 0 && (
					<div className='flex flex-col gap-2'>
						<p className='text-sm font-medium'>{t('members')}</p>
						<ul className='flex flex-col gap-1'>
							{publicGroup.members.map(m => (
								<li key={m.userId} className='flex items-center gap-2'>
									<Avatar className='size-7'>
										<AvatarImage
											src={
												m.user.picture
													? m.user.picture.replace(
															'/upload/',
															'/upload/w_100,h_100,c_fill,f_webp,q_80/'
													  )
													: ''
											}
										/>
										<AvatarFallback className='text-xs'>
											{m.user.displayName.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className='text-sm'>{m.user.displayName}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{publicGroup.currentUserStatus === null && (
					<Button onClick={() => sendJoinRequest()} disabled={isSendingJoinRequest}>
						{t('groupJoinRequest')}
					</Button>
				)}
				{publicGroup.currentUserStatus === 'PENDING' && (
					<Button disabled variant='outline'>
						{t('groupJoinRequestPending')}
					</Button>
				)}
				{publicGroup.currentUserStatus === 'REJECTED' && (
					<Button onClick={() => sendJoinRequest()} disabled={isSendingJoinRequest}>
						{t('groupJoinRequestAgain')}
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
