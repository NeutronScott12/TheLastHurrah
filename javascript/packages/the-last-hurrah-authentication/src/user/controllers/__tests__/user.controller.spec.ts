import { ClientsModule, RpcException } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as faker from 'faker'

import { AuthEmailProducer } from '../../../user/producers/auth-email.producer'
import { ApplicationService } from '../../../user/services/application.service'
import { PrismaService } from '../../../prisma/prisma.service'
import { UserService } from '../../../user/services/user.service'
import { UserController } from '../user.controller'
import { grpClient } from '../../../configs/grpcClient.config'
import { AUTH_EMAIL_QUEUE } from '../../../constants'
import { cacheConfigAsync } from '../../../configs/cache.config'
import { configOptions } from '../../../configs'

describe('User GRPC Controller', () => {
    let userController: UserController
    let userService: UserService

    let email: string = faker.internet.email()
    let email2: string = faker.internet.email()
    let username: string = faker.internet.userName()
    let username2: string = faker.internet.userName()
    let password: string = faker.internet.password()

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register(grpClient),
                BullModule.registerQueue({ name: AUTH_EMAIL_QUEUE }),
                CacheModule.registerAsync(cacheConfigAsync),
                ConfigModule.forRoot(configOptions),
            ],
            providers: [
                PrismaService,
                UserService,
                AuthEmailProducer,
                ApplicationService,
            ],
            controllers: [UserController],
        }).compile()

        userController = module.get<UserController>(UserController)
        userService = module.get<UserService>(UserService)
    })

    it('User Controller should be defined', () => {
        expect(userController).toBeDefined()
    })

    it('User Service should be defined', () => {
        expect(userService).toBeDefined()
    })

    it('getUserById', async () => {
        const user = await userService.register({
            data: { email, username, password },
        })

        const response = await userController.getUserById({ user_id: user.id })

        expect(response).toBeTruthy()
        expect(response).toHaveProperty('email', email)

        if (response) {
            await userService.delete({
                where: {
                    id: response.id,
                },
            })
        }
    })

    it('getUsersByIds', async () => {
        const userOne = await userService.register({
            data: { email, username, password },
        })
        const userTwo = await userService.register({
            data: { email: email2, username: username2, password },
        })

        const response = await userController.getUsersByIds({
            user_ids: [userOne.id, userTwo.id],
        })

        expect(response.users).toBeTruthy()
        expect(response.users).toHaveLength(2)

        if (response) {
            const ids = response.users.map((user) => user.id)

            await userService.deleteMany({
                where: {
                    id: { in: ids },
                },
            })

            const result = await userController.getUsersByIds({
                user_ids: [userOne.id, userTwo.id],
            })

            expect(result.users).toHaveLength(0)
        }
    })

    // it('getUserById empty arguments', async () => {
    //     const response = await userController.getUserById({ user_id: '' })

    //     const error = new RpcException({
    //         success: false,
    //         message: 'Empty arguments',
    //     })

    //     console.log('RESPONSE', response)

    //     expect(response).toEqual(error)
    // })
})
