import { IGroupMember } from './groupe.types'

export enum UserRole {
	Regular = 'REGULAR',
	Admin = 'ADMIN'
}

export enum AuthMethod {
	Credentials = 'CREDENTIALS',
	Google = 'GOOGLE'
}

export enum FriendStatus {
	Pending = 'PENDING',
	Accepted = 'ACCEPTED',
	Rejected = 'REJECTED'
}

export interface IAccount {
	id: string
	createdAt: string
	updatedAt: string
	type: string
	provider: string
	refreshToken: string
	accessToken: string
	expiresAt: number
	userId: string
}

export interface IUser {
	id: string
	createdAt: string
	updatedAt: string
	email: string
	password: string
	displayName: string
	picture: string
	role: UserRole
	isVerified: boolean
	isTwoFactorEnabled: boolean
	method: AuthMethod
	accounts: IAccount[]
	groupMemberships: IGroupMember[]
}

export interface IUserSafe {
	id: string
	email: string
	displayName: string
	picture: string
}

export interface IFriend {
	id: string
	senderId: string
	sender: IUser
	receiver: IUser
	receiverId: string
	createdAt: string
	updatedAt: string
	status: FriendStatus
}

export interface ResponseIfriend {
	friends: IFriend[]
	friendRequests: IFriend[]
	friendRequestsSended: IFriend[]
}
