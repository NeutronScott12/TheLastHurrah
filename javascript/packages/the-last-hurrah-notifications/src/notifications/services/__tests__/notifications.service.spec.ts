import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../../prisma_service/prisma.service'
import { NotificationService } from '../notifications.service'

describe('NotificationsService', () => {
    let service: NotificationService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NotificationService, PrismaService],
        }).compile()

        service = module.get<NotificationService>(NotificationService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
