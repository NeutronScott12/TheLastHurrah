import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './prisma.service'

describe('PrismaService', () => {
    let service: PrismaService
    let module: TestingModule
    let app: INestApplication

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [PrismaService],
        }).compile()

        app = module.createNestApplication()

        service = module.get<PrismaService>(PrismaService)

        service.onModuleInit()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    afterAll(async () => {
        await service.enableShutdownHooks(app)
        await service.$disconnect()
        await module.close()
    })
})
