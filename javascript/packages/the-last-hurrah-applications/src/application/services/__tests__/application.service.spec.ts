import { BullModule } from '@nestjs/bull'
import { ClientsModule } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'

import { grpClient } from '../../../configs/grpClient.config'
import { ApplicationProducer } from '../../../application/producers/application.producer'
import { PrismaService } from '../../../prisma/prisma.service'
import { ApplicationService } from '../application.service'
import { ThreadGrpcService } from '../thread-grpc.service'

describe('ApplicationService', () => {
    let service: ApplicationService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ClientsModule.register(grpClient), BullModule.registerQueue({ name: 'comment_queue' })],
            providers: [ApplicationService, ApplicationProducer, ThreadGrpcService, PrismaService],
        }).compile()

        service = module.get<ApplicationService>(ApplicationService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
