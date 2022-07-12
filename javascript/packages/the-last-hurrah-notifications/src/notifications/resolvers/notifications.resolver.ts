import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
    SUCCESSFULLY_DELETED_NOTIFICATION,
    SUCCESSFULLY_DELETED_NOTIFICATIONS,
} from '../../constants'
import { DeleteManyNotificationsInput } from '../dto/delete-many-notifications.input'
import { DeleteNotificationInput } from '../dto/delete-notification.input'
import { FetchNotificationByApplicationIdInput } from '../dto/fetch-notification-by-application-id.input'
import { FetchNotificationByApplicationShortNameInput } from '../dto/fetch-notification-by-short-name.input'
import { FetchNotificationsByUserIdInput } from '../dto/fetch-notifications-by-user-id.input'
import { NotificationEntity } from '../entities/notification.entity'
import { StandardResponse } from '../entities/standard-response.entity'
import { ApplicationService } from '../services/application.service'
import { NotificationService } from '../services/notifications.service'

@Resolver()
export class NotificationsResolver {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly applicationService: ApplicationService,
    ) {}

    @Query(() => [NotificationEntity])
    async fetch_notifications() {
        try {
            return this.notificationService.findMany({})
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [NotificationEntity])
    async fetch_notifications_by_short_name(
        @Args('fetchNotificationByApplicationShortNameInput')
        { short_name }: FetchNotificationByApplicationShortNameInput,
    ) {
        try {
            const { id } =
                await this.applicationService.getApplicationByShortName({
                    short_name,
                })
            return this.notificationService.findMany({
                where: { application_id: id },
            })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [NotificationEntity])
    async fetch_notifications_by_application_id(
        @Args('fetchNotificationsByApplicationIdInput')
        { application_id }: FetchNotificationByApplicationIdInput,
    ) {
        try {
            return this.notificationService.findMany({
                where: { application_id },
            })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Query(() => [NotificationEntity])
    async fetch_notifications_by_user_id(
        @Args('fetchNotificationsByUserIdInput')
        { user_id }: FetchNotificationsByUserIdInput,
    ) {
        try {
            return this.notificationService.findMany({ where: { user_id } })
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponse)
    async delete_notification(
        @Args('deleteNotification') { id }: DeleteNotificationInput,
    ) {
        try {
            await this.notificationService.delete({ where: { id } })

            return {
                success: true,
                message: SUCCESSFULLY_DELETED_NOTIFICATION,
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }

    @Mutation(() => StandardResponse)
    async delete_many_notifications(
        @Args('deleteManyNotifications')
        { notifications_ids }: DeleteManyNotificationsInput,
    ) {
        try {
            await this.notificationService.deleteMany({
                where: { id: { in: notifications_ids } },
            })

            return {
                success: true,
                message: SUCCESSFULLY_DELETED_NOTIFICATIONS,
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
