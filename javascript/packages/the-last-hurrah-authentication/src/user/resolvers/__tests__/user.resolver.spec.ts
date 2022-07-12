import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'

import * as faker from 'faker'
import { createToken } from '@thelasthurrah/the-last-hurrah-shared'
import { GraphQLFederationModule } from '@nestjs/graphql'

import { Test, TestingModule } from '@nestjs/testing'
import { configOptions } from '../../../configs'
import { cacheConfigAsync } from '../../../configs/cache.config'
import { grpClient } from '../../../configs/grpcClient.config'
import {
    AUTH_EMAIL_QUEUE,
    CHECK_EMAIL_CODE,
    JWT_SECRET,
    PASSWORD_SUCCESSFULLY_CHANGED,
    SUCCESSFULLY_LOGGED_IN,
    USER_HAS_BEEN_CONFIRMED,
} from '../../../constants'
import { PrismaService } from '../../../prisma/prisma.service'
import { AuthEmailProducer } from '../../../user/producers/auth-email.producer'
import { ApplicationService } from '../../../user/services/application.service'
import { UserService } from '../../../user/services/user.service'
import { UserResolver } from '../user.resolver'
import { AsyncGraphqlOptions } from '../../../configs/graphql.config'

describe('User Resolver', () => {
    let userService: UserService
    let userResolver: UserResolver
    let registered_user: any

    let email: string = faker.internet.email()
    let email2 = faker.internet.email()
    let username: string = faker.internet.userName()
    let password: string = faker.internet.password()

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                GraphQLFederationModule.forRootAsync(AsyncGraphqlOptions),
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
                UserResolver,
            ],
        }).compile()

        userService = module.get<UserService>(UserService)
        userResolver = module.get<UserResolver>(UserResolver)

        registered_user = await userResolver.register_user({
            application_id: '1',
            email,
            password,
            two_factor_authentication: false,
            username,
            redirect_url: '',
        })
    })

    it('User Service is defined', () => {
        expect(userService).toBeDefined()
    })

    it('login_user', async () => {
        const response = await userResolver.login_user({ email, password })

        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty('message', SUCCESSFULLY_LOGGED_IN)
    })

    it('two_factor_login', async () => {
        const user = await userResolver.register_user({
            application_id: '1',
            email: email2,
            password,
            two_factor_authentication: true,
            username,
            redirect_url: '',
        })

        expect(user).toBeDefined()
        expect(user).toHaveProperty('success', true)

        const response = await userResolver.login_user({
            email: email2,
            password,
        })

        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty('two_factor_authentication', true)
        expect(response).toHaveProperty('message', CHECK_EMAIL_CODE)
    })

    it('change password', async () => {
        const newPassword = faker.internet.password()
        const response = await userResolver.change_password({
            email,
            password: newPassword,
        })

        expect(response).toBeDefined()
        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty(
            'message',
            PASSWORD_SUCCESSFULLY_CHANGED,
        )

        const user = await userResolver.login_user({
            email,
            password: newPassword,
        })

        expect(user).toHaveProperty('success', true)
    })

    // it('Change Password, old and new password conflict', async () => {
    //     console.log('EMAIL', email)
    //     const response = await userResolver.change_password({
    //         email,
    //         password,
    //     })
    //     expect(response).toThrow(
    //         new NotFoundException({
    //             success: false,
    //             message: "'Previously used passwords are not acceptable'",
    //         }),
    //     )
    // })

    it('confirm user', async () => {
        const result = await userResolver.login_user({
            email,
            password,
        })
        // MASSIVE TODO, CHANGE WHEN NEW CONFIRMATION TOKEN IMPLEMENTED
        const [token] = createToken(
            //@ts-ignore
            { id: result.user.id, username, email, confirmed: true },
            JWT_SECRET,
            {},
            'my_refresh_secret',
            { username, email, confirmed: true },
        )
        const response = await userResolver.confirm_user(token)

        expect(response).toBeDefined()
        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty('message', USER_HAS_BEEN_CONFIRMED)
    })

    afterAll(async () => {
        await userService.delete({ where: { email } })
        await userService.delete({ where: { email: email2 } })
    })
})
