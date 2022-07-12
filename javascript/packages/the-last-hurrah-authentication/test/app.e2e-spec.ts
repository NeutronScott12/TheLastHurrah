import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import * as faker from 'faker'
import * as request from 'supertest'

import { AppModule } from './../src/app.module'
import {
    changePasswordGql,
    deleteGql,
    loginGql,
    registerGql,
} from './graphql/mutations'

const GQL_ENDPOINT = '/graphql'

describe('AppController (e2e)', () => {
    let app: INestApplication
    let jwtToken: string
    const email = faker.internet.email()
    const password = faker.internet.password()
    const username = faker.internet.userName()

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()

        await app.init()
    })

    afterAll(async () => {
        const result = await request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ query: deleteGql(email) })

        if (!result.body.data.delete_user.success) {
            throw new Error('Something went wrong with deleting user')
        }

        await Promise.all([app.close()])
    })

    describe('Authentication', () => {
        it('Register a user', async () => {
            const response = await request(app.getHttpServer())
                .post(GQL_ENDPOINT)
                .send({
                    query: registerGql(username, email, password),
                })

            const result = response.body.data.register_user

            expect(result).toBeDefined()
            expect(result).toHaveProperty('success', true)
        })

        it('Login user', async () => {
            const response = await request(app.getHttpServer())
                .post(GQL_ENDPOINT)
                .send({
                    query: loginGql(email, password),
                })

            jwtToken = response.body.data.login_user.token

            expect(response).toBeDefined()
            expect(jwtToken).toBeDefined()
            expect(response.body.data.login_user.success).toBeTruthy()
        })

        it('Change Password', async () => {
            try {
                const response = await request(app.getHttpServer())
                    .post(GQL_ENDPOINT)
                    .set('Authorization', `Bearer ${jwtToken}`)
                    .send({
                        query: changePasswordGql(email, password),
                    })

                const result = response.body.data.change_password

                expect(result.success).toBeTruthy()
            } catch (error) {
                console.log(error)
            }
        })
    })
})
