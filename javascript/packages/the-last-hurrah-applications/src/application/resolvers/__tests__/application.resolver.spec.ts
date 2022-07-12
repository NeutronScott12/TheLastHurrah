import { Test, TestingModule } from '@nestjs/testing'
import { BullModule } from '@nestjs/bull'
import { Application } from '@prisma/client'

import { ApplicationResolver } from '../application.resolver'
import { ApplicationService } from '../../services/application.service'
import { ApplicationProducer } from '../../../application/producers/application.producer'
import { PrismaService } from '../../../prisma/prisma.service'
import { ThreadGrpcService } from '../../services/thread-grpc.service'
import { grpClient } from '../../../configs/grpClient.config'
import { ClientsModule } from '@nestjs/microservices'

describe('ApplicationResolver', () => {
    let resolver: ApplicationResolver

    let application: Application

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register(grpClient),
                BullModule.registerQueue({ name: 'comment_queue' }),
                BullModule.registerQueue({ name: 'application_queue' }),
            ],
            providers: [
                ApplicationResolver,
                ApplicationService,
                ApplicationProducer,
                ThreadGrpcService,
                PrismaService,
            ],
        }).compile()

        resolver = module.get<ApplicationResolver>(ApplicationResolver)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
})
