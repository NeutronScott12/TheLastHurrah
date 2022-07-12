import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../../../prisma/prisma.service'
import { CommenceService } from '../../services/commence.service'
import { CommenceResolver } from '../commence.resolver'

describe('CommenceResolver', () => {
    let resolver: CommenceResolver

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CommenceResolver, CommenceService, PrismaService],
        }).compile()

        resolver = module.get<CommenceResolver>(CommenceResolver)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
})
