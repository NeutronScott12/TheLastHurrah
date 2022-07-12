/* eslint-disable */
import { util, configure } from 'protobufjs/minimal'
import * as Long from 'long'
import { Observable } from 'rxjs'

export const protobufPackage = 'notification'

export interface ApplicationNotificationArgs {
    message: string
    application_id: string
    url: string
}

export interface NotificationCreateOneArgs {
    message: string
    userId: string
    url: string
}

export interface NotificationComplete {
    success: boolean
    message: string
}

export interface HealthCheckRequest {
    service: string
}

export interface HealthCheckResponse {
    status: HealthCheckResponse_ServingStatus
}

export enum HealthCheckResponse_ServingStatus {
    UNKNOWN = 0,
    SERVING = 1,
    NOT_SERVING = 2,
    SERVICE_UNKNOWN = 3,
    UNRECOGNIZED = -1,
}

export interface INotificationService {
    createApplicationNotification(
        request: ApplicationNotificationArgs,
    ): Observable<NotificationComplete>
    createProfileNotification(
        request: NotificationCreateOneArgs,
    ): Observable<NotificationComplete>
    Check(request: HealthCheckRequest): Observable<HealthCheckResponse>
}

type Builtin =
    | Date
    | Function
    | Uint8Array
    | string
    | number
    | boolean
    | undefined
export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
    util.Long = Long as any
    configure()
}
