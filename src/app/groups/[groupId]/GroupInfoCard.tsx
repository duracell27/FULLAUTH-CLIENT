'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/shared/componets/ui'
import { useDeleteGroupMutation } from '@/shared/hooks/useDeleteGroupMutation'
import { useTranslations } from '@/shared/hooks'
import { GroupRole } from '@/shared/types'
import { Language, IUser } from '@/shared/types/user.types'
import { IGroup } from '@/shared/types/groupe.types'
import colorBalance from '@/shared/utils/colorBalance'
import { formatNumberWithSpaces } from '@/shared/utils/formatBalance'
import { formatDate } from '@/shared/utils'
import { BookmarkCheck, Edit2, Eye, Lock, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
	group: IGroup
	user: IUser
}

export const GroupInfoCard = ({ group, user }: Props) => {
	const { t } = useTranslations()
	const { deleteGroup } = useDeleteGroupMutation()

	const isAdmin = group.members.some(
		member => member.userId === user.id && member.role === GroupRole.ADMIN
	)

	return (
		<Card className=''>
			<CardHeader className='p-0'>
				<CardTitle
					className={`flex relative gap-2 items-center justify-between h-50 rounded-lg px-5 ${
						group.avatarUrl === ''
							? 'bg-primary/40'
							: 'bg-cover bg-center'
					}`}
					style={
						group.avatarUrl !== ''
							? {
									backgroundImage: `url(${group.avatarUrl})`
							  }
							: {}
					}
				>
					{group.avatarUrl === '' && (
						<div className='w-full flex items-center justify-center  text-background '>
							{group.isPersonal ? (
								<div className='flex items-center gap-2'>
									{group.members
										.slice(0, 2)
										.map((member) => (
											<Avatar
												key={member.userId}
												className='size-20 border-2 border-background'
											>
												<AvatarImage
													src={
														member.user.picture || ''
													}
													alt={
														member.user.displayName
													}
												/>
												<AvatarFallback className='text-lg font-semibold'>
													{member.user.displayName
														.slice(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
										))}
								</div>
							) : (
								<span className='bg-primary rounded-full px-5 py-2'>
									{group.name.slice(0, 2).toUpperCase()}
								</span>
							)}
						</div>
					)}
					<div className='absolute -bottom-2 inset-x-5 gap-5 flex justify-between items-center  text-background bg-primary rounded-full px-5 py-2'>
						<h1 className=''>{group.name}</h1>
						<span>
							{isAdmin ? (
								<div className='flex gap-2 items-center'>
									<Link href={`/groups/edit/${group.id}`}>
										<Button size={'xs'}>
											<Edit2 className='size-4' />
										</Button>
									</Link>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												size={'xs'}
												className='bg-bad-red hover:bg-bad-red/80'
											>
												<Trash className='size-4' />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													{t('areYouAbsolutelySure')}
												</AlertDialogTitle>
												<AlertDialogDescription>
													{t(
														'thisActionCannotBeUndoneThisWillPermanentlyDeleteThisGroup'
													)}
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													{t('cancel')}
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => deleteGroup(group.id)}
													className='bg-bad-red hover:bg-bad-red/80'
												>
													{t('continue')}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							) : (
								''
							)}
						</span>
					</div>

					{group.avatarUrl !== '' && (
						<div className='absolute top-3 right-3'>
							<Dialog>
								<DialogTrigger>
									<DialogTitle></DialogTitle>
									<div className='rounded-full bg-white/30 text-background/50 p-1'>
										<Eye />
									</div>
								</DialogTrigger>
								<DialogContent className='w-[90vw] max-w-none rounded-md'>
									<Image
										src={group.avatarUrl || ''}
										alt=''
										width={0}
										height={0}
										sizes='100vw'
										style={{
											width: '100%',
											height: 'auto',
											maxHeight: '75vh',
											objectFit: 'contain'
										}}
									/>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className='mt-4'>
				<div className='flex items-center gap-2'>
					{t('groupExpenses')}:{' '}
					<span className='font-bold'>
						{formatNumberWithSpaces(group.totalExpenses)}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					{t('yourTotalExpenses')}:{' '}
					<span className='font-bold'>
						{formatNumberWithSpaces(group.userTotalExpenses)}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					{t('yourBalance')}:{' '}
					<span className='font-bold'>
						{colorBalance({ balance: group.userTotalBalance })}
					</span>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<p className='text-xs mt-1 cursor-pointer w-fit'>
							{formatDate(
								group.eventDate,
								'PP',
								user?.language || Language.EN
							)}
						</p>
					</PopoverTrigger>
					<PopoverContent className='w-auto'>
						<p className='text-sm'>{formatDate(group.eventDate, 'PPpp', user?.language || Language.EN)}</p>
					</PopoverContent>
				</Popover>

				{group.isLocked && (
					<div className='flex justify-center items-center gap-2 bg-bad-red px-2 rounded-full text-white mt-1'>
						<Lock className='size-4 ' />
						<span>{t('locked')}</span>
					</div>
				)}
				{group.isFinished && (
					<div className='flex justify-center items-center gap-2 bg-good-green px-2 rounded-full text-white mt-1'>
						<BookmarkCheck className='size-4 ' />
						<span>{t('finished')}</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
