'use client'
import { LuLogOut } from 'react-icons/lu'
import { useLogoutMutation } from '../hooks'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Skeleton
} from './ui'
import { IUser } from '../types'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface UserButtonProps {
	user: IUser | undefined
}

export function UserButton({ user }: UserButtonProps) {
	const [open, setOpen] = useState(false)
	const { logout, isLoadingLogout } = useLogoutMutation()

	if (!user) return null

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger className='flex items-center gap-0.5 bg-primary/10 rounded-full cursor-pointer pl-1'>
				<ChevronDown 
					className={`h-4 w-4 transition-transform duration-200 ${
						open ? 'rotate-180' : ''
					}`} 
				/>
				<Avatar>
					<AvatarImage src={user.picture} />
					<AvatarFallback>
						{user.displayName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40 ' align='end'>
				<DropdownMenuItem
					disabled={isLoadingLogout}
					onClick={() => logout()}
				>
					<LuLogOut className='mr-2 size-4' />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function UserButtonLoading() {
	return <Skeleton className='w-10 h-10 rounded-full' />
}
