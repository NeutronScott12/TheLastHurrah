import { Observable } from 'rxjs'

export interface IAuthenticationService {
    getUserById: (args: IGetUserByArgs) => Observable<IUser>
    getUsersByIds: (args: IGetUsersByIdsArgs) => Observable<IUsers>
}

export interface IGetUserByArgs {
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
    confirmed: boolean
    online: boolean
}
