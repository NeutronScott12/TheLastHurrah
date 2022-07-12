import { Controller } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'
import {
    APPLICATION_NOTIFICATION_SENT,
    HEALTH_GRPC_SERVICE,
    NOTIFICATION_GRPC_SERVICE,
    PROFILE_NOTIFICATION_SENT,
} from '../../constants'
import {
    ApplicationNotificationArgs,
    NotificationComplete,
    NotificationCreateOneArgs,
} from '../proto/types'
import { HealthService } from '../services/heath.service'
import { NotificationService } from '../services/notifications.service'

@Controller()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly healthService: HealthService,
    ) {}

    @Public()
    @GrpcMethod(HEALTH_GRPC_SERVICE, 'Check')
    checkHealth() {
        return this.healthService.check()
    }

    @Public()
    @GrpcMethod(NOTIFICATION_GRPC_SERVICE, 'Check')
    check_grpc_health() {
        return this.healthService.check()
    }

    @Public()
    @GrpcMethod(NOTIFICATION_GRPC_SERVICE, 'createApplicationNotification')
    async createApplicationNotification(
        args: ApplicationNotificationArgs,
    ): Promise<NotificationComplete> {
        try {
            await this.notificationService.create({
                data: {
                    ...args,
                    application_id: args.application_id,
                },
            })

            return {
                success: true,
                message: APPLICATION_NOTIFICATION_SENT,
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.message,
            })
        }
    }

    @Public()
    @GrpcMethod(NOTIFICATION_GRPC_SERVICE, 'createProfileNotification')
    async createProfileNotification(
        args: NotificationCreateOneArgs,
    ): Promise<NotificationComplete> {
        try {
            const response = await this.notificationService.create({
                data: {
                    ...args,
                },
            })

            return {
                success: true,
                message: PROFILE_NOTIFICATION_SENT,
            }
        } catch (error) {
            throw new RpcException({
                success: false,
                error: error.message,
            })
        }
    }
}
