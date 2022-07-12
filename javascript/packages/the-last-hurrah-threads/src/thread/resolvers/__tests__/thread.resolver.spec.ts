import { Test, TestingModule } from '@nestjs/testing'

import * as faker from 'faker'

import { ThreadResolver } from '../thread.resolver'
import { ThreadService } from '../../services/thread.service'
import { PrismaService } from '../../../prisma/prisma.service'
import { ApplicationModel } from '../../../thread/entities/application.entity'

describe('ThreadResolver', () => {
    let resolver: ThreadResolver
    // let applicationService: ApplicationService

    let application: ApplicationModel
    let application_owner_id: string = faker.datatype.uuid()
    let application_name: string = faker.name.title()
    let title: string = faker.name.title()
    let website_url: string = faker.internet.url()
    let thread_id: string

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ThreadResolver,
                ThreadService,
                // ApplicationService,
                PrismaService,
            ],
        }).compile()

        resolver = module.get<ThreadResolver>(ThreadResolver)
        // applicationService = module.get<ApplicationService>(ApplicationService)

        // application = await applicationService.create({
        //     application_name,
        //     application_owner_id,
        // })
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
        // expect(applicationService).toBeDefined()
    })

    it('find_one_thread_or_create_one', async () => {
        const response = await resolver.find_one_thread_or_create_one({
            application_id: application.id,
            title,
            website_url,
        })

        thread_id = response.id

        expect(response).toHaveProperty('title', title)
        expect(response).toHaveProperty('website_url', website_url)
    })

    it('fetch_threads_by_user_id', async () => {
        const response = await resolver.fetch_threads_by_user_id({
            user_id: application_owner_id,
        })

        expect(response).toBeDefined()
    })

    it('find_thread_by_id', async () => {
        const response = await resolver.find_thread_by_id({ thread_id })

        expect(response).toHaveProperty('id', thread_id)
        expect(response).toHaveProperty('title', title)
    })

    afterAll(async () => {
        // await applicationService.remove({ where: { id: application.id } })
    })
})
