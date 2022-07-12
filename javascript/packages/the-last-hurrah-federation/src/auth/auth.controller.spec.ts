import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../prisma/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
    let controller: AuthController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, PrismaService],
            controllers: [AuthController],
        }).compile()

        controller = module.get<AuthController>(AuthController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
