import { ClientsModule } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { pick, pluck } from 'ramda'

import { NotificationController } from '../../../notifications/controllers/notification.controller'
import { GrpcClientOptions } from '../../../configs/GrpcClientOptions'
import { ApplicationService } from '../../../notifications/services/application.service'
import { PrismaService } from '../../../prisma_service/prisma.service'
import { NotificationService } from '../../services/notifications.service'
import { NotificationsResolver } from '../notifications.resolver'
import { HealthService } from '../../../notifications/services/heath.service'
import { SUCCESSFULLY_DELETED_NOTIFICATIONS } from '../../../constants'

describe('NotificationsResolver', () => {
    let resolver: NotificationsResolver
    let controller: NotificationController
    let prisma: PrismaService

    let application_id = '1234'
    let url = 'http://localhost:3000'
    let user_id = '1234'

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ClientsModule.register(GrpcClientOptions)],
            providers: [
                NotificationsResolver,
                NotificationService,
                PrismaService,
                ApplicationService,
                HealthService,
            ],
            controllers: [NotificationController],
        }).compile()

        resolver = module.get<NotificationsResolver>(NotificationsResolver)
        controller = module.get<NotificationController>(NotificationController)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    it('fetch notifications', async () => {
        const notifications = await resolver.fetch_notifications()

        expect(notifications).toBeTruthy()
    })

    it('fetch notification by ID', async () => {
        const created_notification =
            await resolver.fetch_notifications_by_application_id({
                application_id: '',
            })

        expect(created_notification).toEqual([])
    })

    it('fetch_notifications_by_application_id', async () => {
        await controller.createApplicationNotification({
            application_id,
            message: 'random',
            url,
        })

        const response = await resolver.fetch_notifications_by_application_id({
            application_id,
        })

        expect(response[0]).toHaveProperty('application_id', application_id)

        if (response) {
            const notification = response.find(
                (resp) => resp.application_id === application_id,
            )

            await resolver.delete_notification({ id: notification.id })
        }
    })

    it('fetch_notification_by_user_id', async () => {
        await controller.createProfileNotification({
            user_id,
            url,
            message: 'whatever',
        })

        const response = await resolver.fetch_notifications_by_user_id({
            user_id,
        })

        expect(response[0]).toHaveProperty('user_id', user_id)

        if (response) {
            const notification = response.find(
                (resp) => resp.user_id === user_id,
            )

            await resolver.delete_notification({ id: notification.id })
        }
    })

    it('delete_many_notifications', async () => {
        await controller.createApplicationNotification({
            application_id,
            url,
            message: 'whatever 1',
        })
        await controller.createApplicationNotification({
            application_id,
            url,
            message: 'whatever 2',
        })

        const notifications =
            await resolver.fetch_notifications_by_application_id({
                application_id,
            })

        expect(notifications).toHaveLength(2)

        const idList = notifications.map((notification) => notification.id)

        const response = await resolver.delete_many_notifications({
            notifications_ids: idList,
        })

        expect(response).toStrictEqual({
            message: SUCCESSFULLY_DELETED_NOTIFICATIONS,
            success: true,
        })
    })
})
