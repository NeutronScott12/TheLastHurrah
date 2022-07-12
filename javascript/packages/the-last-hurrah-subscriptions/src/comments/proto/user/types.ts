import { Observable } from 'rxjs'

export interface IGetUserByArgs {
    user_id: string
}

export interface IUser {
    id: string
    username: string
    email: string
}

export interface IAuthenticationService {
    getUserById: (args: IGetUserByArgs) => Observable<IUser>
}
