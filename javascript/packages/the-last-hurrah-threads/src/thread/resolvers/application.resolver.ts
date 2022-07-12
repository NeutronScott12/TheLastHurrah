import { InternalServerErrorException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ApplicationModel } from '../entities/application.entity'
import { ThreadModel } from '../entities/thread.entity'
import { ThreadService } from '../services/thread.service'

@Resolver(() => ApplicationModel)
export class ApplicationResolver {
    constructor(private readonly threadService: ThreadService) {}

    @ResolveField('threads', () => [ThreadModel])
    async getThreads(@Parent() { application_id }: ThreadModel) {
        try {
            return this.threadService.findAll({
                where: {
                    application_id,
                },
                include: { views: true },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
