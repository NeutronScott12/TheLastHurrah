import { Observable } from 'rxjs'

interface IBaseArgs {
    message: string
    url: string
}

export interface NotificationCreateOneArgs extends IBaseArgs {
    user_id: string
}

export interface ApplicationNotificationArgs extends IBaseArgs {
    application_id: string
}

export interface NotificationComplete {
    success: boolean
    message: string
}

export interface IFindOneApplicationByShortNameArgs {
    short_name: string
}

export interface ApplicationDto {
    id: string
}

export interface IApplicationService {
    findOneApplicationByShortName: (
        args: IFindOneApplicationByShortNameArgs,
    ) => Observable<ApplicationDto>
}

export enum ServingStatus {
    UNKNOWN,
    SERVING,
    NOT_SERVING,
}

export interface HealthCheckRequest {
    service: string
}

export interface HealthCheckResponse {
    status: ServingStatus
}

export interface IHealthService {
    check(args: HealthCheckRequest): HealthCheckResponse
}
