import { Test, TestingModule } from '@nestjs/testing'
import { PaymentService } from '../../../modules/SquareModule/services/payment.service'
import { SquareModule } from '../../../modules/SquareModule/SquareCore'
import { PrismaService } from '../../../prisma/prisma.service'
import { CommenceService } from '../commence.service'

describe('CommenceService', () => {
    let service: CommenceService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SquareModule],
            providers: [CommenceService, PrismaService, PaymentService],
        }).compile()

        service = module.get<CommenceService>(CommenceService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
