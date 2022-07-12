import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../../../prisma/prisma.service'
import { configOptions } from '../../../configs/config'
import { grpClient } from '../../../configs/grpClient.config'
import { ApplicationService } from '../../../application/services/application.service'
import { ApplicationController } from '../application.controller'
import { UserGrpcService } from '../../../application/services/user-grpc.service'
import { Application } from '@prisma/client'
import { ApplicationProducer } from '../../../application/producers/application.producer'
import { ThreadGrpcService } from '../../../application/services/thread-grpc.service'
import { BullModule } from '@nestjs/bull'

describe('Application GRPC Controller', () => {
    let applicationService: ApplicationService
    let applicationController: ApplicationController

    let application: Application

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register(grpClient),
                ConfigModule.forRoot(configOptions),
                BullModule.registerQueue({ name: 'comment_queue' }),
            ],
            providers: [
                PrismaService,
                ApplicationService,
                ApplicationService,
                UserGrpcService,
                ApplicationProducer,
                ThreadGrpcService,
            ],
            controllers: [ApplicationController],
        }).compile()

        applicationController = module.get<ApplicationController>(
            ApplicationController,
        )
        applicationService = module.get<ApplicationService>(ApplicationService)

        application = await applicationService.create({
            application_name: 'Test Application',
            application_owner_id: '1234',
        })
    })

    it('Application controller is defined', () => {
        expect(applicationController).toBeDefined()
    })

    it('Application service is defined', () => {
        expect(applicationService).toBeDefined()
    })

    it('findOneApplicationByShortName', async () => {
        const response =
            await applicationController.findOneApplicationByShortName({
                short_name: application.short_name,
                application_id: application.id,
                application_name: application.application_name,
                pre_comment_moderation: 'ALL',
            })

        expect(response).toHaveProperty('short_name', response.short_name)
        expect(response).toHaveProperty('id', response.id)
    })

    it('findOneApplicationById', async () => {
        const response = await applicationController.findOneApplicationById({
            id: application.id,
        })

        expect(response).toHaveProperty('short_name', response.short_name)
        expect(response).toHaveProperty('id', response.id)
    })

    afterAll(async () => {
        await applicationService.remove({ where: { id: application.id } })
    })
})
