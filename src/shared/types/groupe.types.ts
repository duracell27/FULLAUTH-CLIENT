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
}

export interface IGroupMember {
	userId: string
	groupId: string
	role: GroupRole
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