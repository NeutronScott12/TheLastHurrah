
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface FetchNotificationByApplicationShortNameInput {
    short_name: string;
}

export interface FetchNotificationByApplicationIdInput {
    application_id: string;
}

export interface FetchNotificationsByUserIdInput {
    user_id: string;
}

export interface DeleteNotificationInput {
    id: string;
}

export interface DeleteManyNotificationsInput {
    notifications_ids: string[];
}

export interface NotificationEntity {
    id: string;
    created_at: DateTime;
    updated_at: DateTime;
    message: string;
    application_id?: Nullable<string>;
    url: string;
}

export interface StandardResponse {
    success: boolean;
    message: string;
}

export interface IQuery {
    fetch_notifications(): NotificationEntity[] | Promise<NotificationEntity[]>;
    fetch_notifications_by_short_name(fetchNotificationByApplicationShortNameInput: FetchNotificationByApplicationShortNameInput): NotificationEntity[] | Promise<NotificationEntity[]>;
    fetch_notifications_by_application_id(fetchNotificationsByApplicationIdInput: FetchNotificationByApplicationIdInput): NotificationEntity[] | Promise<NotificationEntity[]>;
    fetch_notifications_by_user_id(fetchNotificationsByUserIdInput: FetchNotificationsByUserIdInput): NotificationEntity[] | Promise<NotificationEntity[]>;
}

export interface IMutation {
    delete_notification(deleteNotification: DeleteNotificationInput): StandardResponse | Promise<StandardResponse>;
    delete_many_notifications(deleteManyNotifications: DeleteManyNotificationsInput): StandardResponse | Promise<StandardResponse>;
}

export type DateTime = any;
type Nullable<T> = T | null;
