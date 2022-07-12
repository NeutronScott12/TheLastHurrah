import { User } from '@prisma/client'

export interface IGetUsersByIdsArgs {
    user_ids: string[]
}
export interface IGetUserByIdsArgs {
    user_id: string
}

export interface IUsers {
    users: IUser[]
}
export interface IUser {
    id: string
    username: string
    email: string
    blockedUsers: User[]
    confirmed: boolean
    online: boolean
}
