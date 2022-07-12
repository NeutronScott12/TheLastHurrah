import { Observable } from 'rxjs'

export interface IAuthenticationService {
    getUsersByIds: (args: IGetUsersByIdsArgs) => Observable<IUsers>
    getUserById: (args: IGetUserByIdArgs) => Observable<IUser>
}

export interface IGetUserByIdArgs {
    user_id: string
}
export interface IGetUsersByIdsArgs {
    user_ids: string[]
}

export interface IUsers {
    users: IUser[]
}
export interface IUser {
    id: string
    username: string
    email: string
    blockedUsers: IUser[]
    online: boolean
    confirmed: boolean
}
