import { Observable } from 'rxjs'

export interface IAuthenticationService {
    getUsersByIds: (args: IGetUsersByIdsArgs) => Observable<IUsers>
    getUserById: (args: IGetUserById) => Observable<IUser>
}

export interface IGetUserById {
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
}
