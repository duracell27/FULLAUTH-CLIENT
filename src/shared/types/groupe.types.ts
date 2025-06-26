import { IExpense } from "./expense.types"
import { IUser, IUserSafe } from "./user.types"

export interface IGroup {
	id: string
	name: string
	avatarUrl?: string | null
	isFinished: boolean
	eventDate: Date
	createdAt: Date
	updatedAt: Date
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