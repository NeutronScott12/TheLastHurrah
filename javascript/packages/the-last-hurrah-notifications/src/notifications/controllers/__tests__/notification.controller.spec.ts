import { PrismaService } from '../../../prisma/prisma.service'
import { NotificationService } from '../../../notifications/services/notifications.service'
import { NotificationController } from '../notification.controller'
import { HealthService } from '../../../notifications/services/heath.service'
import {
    APPLICATION_NOTIFICATION_SENT,
    PROFILE_NOTIFICATION_SENT,
    SUCCESSFULLY_DELETED_NOTIFICATION,
} from '../../../constants'

describe('Notification Controller', () => {
    let notificationService: NotificationService
    let prismaService: PrismaService
    let healthService: HealthService

    let notificationController: NotificationController

    let application_id: string = '1234'
    let user_id: string = '1234'

    beforeEach(() => {
        healthService = new HealthService()
        prismaService = new PrismaService()
        notificationService = new NotificationService(prismaService)

        notificationController = new NotificationController(
            notificationService,
            healthService,
        )
    })

    it('create application notification', async () => {
        const response =
            await notificationController.createApplicationNotification({
                application_id,
                message: 'whatever',
                url: 'http://localhost:3000',
            })

        expect(response).toStrictEqual({
            message: APPLICATION_NOTIFICATION_SENT,
            success: true,
        })

        const { id } = await prismaService.notification.findFirst({
            where: { application_id },
        })

        if (id) {
            const removed = await prismaService.notification.delete({
                where: { id },
            })

            expect(removed).toHaveProperty('application_id', application_id)
        }
    })

    it('create profile notification', async () => {
        const response = await notificationController.createProfileNotification(
            { user_id, message: 'whatever', url: 'http://localhost:3000' },
        )

        expect(response).toStrictEqual({
            message: PROFILE_NOTIFICATION_SENT,
            success: true,
        })

        const { id } = await prismaService.notification.findFirst({
            where: {
                user_id,
            },
        })

        if (id) {
            const removed = await prismaService.notification.delete({
                where: { id },
            })

            expect(removed).toHaveProperty('user_id', user_id)
        }
    })
})
