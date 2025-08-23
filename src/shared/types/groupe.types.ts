import { IExpense } from './expense.types'
import { IUser, IUserSafe } from './user.types'

export interface IGroup {
	id: string
	name: string
	avatarUrl?: string | null
	isLocked: boolean
	isFinished: boolean
	isPersonal: boolean
	eventDate: Date
	createdAt: Date
	updatedAt: Date
	totalExpenses: number
	userTotalBalance: number
	memberBalanceDetails: {
		user: {
			id: string
			displayName: string
			picture: string | null
		}
		role: GroupRole
		totalBalance: number
		debtDetails: {
			user: {
				id: string
				displayName: string
				picture: string | null
			}
			amount: number
			type: 'owes_to_member' | 'member_owes_to'
		}[]
	}[]
	paymentsBetweenMembers: {
		from: IUserSafe
		to: IUserSafe
		amount: number,
		creators: IUserSafe[]
	}[]
	overpays: {
		from: IUserSafe
		to: IUserSafe
		amount: number
	}[]
	members: IGroupMember[]
	expenses: IExpense[]
}

export interface IGroupMember {
	userId: string
	groupId: string
	role: GroupRole
	status: GroupMemberStatus
	joinedAt: Date
	user: IUserSafe
	group: IGroup
}

export interface IUserGroup {
	id: string
	name: string
	avatarUrl: string
	eventDate: Date
	membersCount: number
	members: IUserSafe[]
	userBalance: number
}

export interface IUserGroupObject {
	finished: IUserGroup[]
	active: IUserGroup[]
}

export enum GroupRole {
	ADMIN = 'ADMIN',
	MEMBER = 'MEMBER'
}

export enum GroupMemberStatus {
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED'
}
