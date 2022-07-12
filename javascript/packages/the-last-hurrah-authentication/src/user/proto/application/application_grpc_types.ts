import { Observable } from 'rxjs'

export interface IActionComplete {
    success: boolean
    message: string
}

export interface IApplicationService {
    setAuthenticatedUser: (
        args: ISetApplicationUserArgs,
    ) => Observable<IActionComplete>
    removeAuthenticatedUser: (
        args: IRemoveApplicationUserArgs,
    ) => Observable<IActionComplete>
    removeUserFromAllApplications: (
        args: IRemoveUserFromAllApplications,
    ) => Observable<IActionComplete>
    checkValidUser: (
        args: ICheckValidUserArgs,
    ) => Observable<ICheckValidUserResponse>
}

export interface ICheckValidUserArgs {
    user_id: string
    application_short_name: string
    application_id?: string
}

export interface ICheckValidUserResponse {
    success: boolean
    message: string
    auth_secret: string
    application_id: string
}
export interface IRemoveUserFromAllApplications {
    user_id: string
    application_ids: string[]
}
export interface ISetApplicationUserArgs {
    application_id: string
    user_id: string
    application_short_name: string
}

export interface IRemoveApplicationUserArgs {
    application_id: string
    user_id: string
}
