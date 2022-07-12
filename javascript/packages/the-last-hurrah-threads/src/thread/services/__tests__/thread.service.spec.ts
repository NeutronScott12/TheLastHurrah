import { Test, TestingModule } from '@nestjs/testing'
import { ApplicationService } from '../../../application/services/application.service'
import { PrismaService } from '../../../prisma/prisma.service'
import { ThreadService } from '../thread.service'

describe('ThreadService', () => {
    let service: ThreadService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ThreadService, PrismaService, ApplicationService],
        }).compile()

        service = module.get<ThreadService>(ThreadService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
