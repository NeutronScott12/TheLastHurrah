// import { NotFoundException } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ApplicationModel } from '../entities/application.entity'
// import { ApplicationModel } from '../entities/application.entity'
import { ThreadModel } from '../entities/thread.entity'
import { ApplicationService } from '../services/application.service'

@Resolver(() => ThreadModel)
export class ThreadResolver {
    constructor(private readonly applicationService: ApplicationService) {}

    // @ResolveField('parent_application', (returns) => ApplicationModel)
    // async get_parent_application(@Parent() { application_id }: ThreadModel) {
    //     try {
    //         console.log('PARENT_APPLICATION', application_id)
    //         return this.applicationService.findOneById({
    //             where: { id: application_id },
    //         })
    //     } catch (error) {
    //         throw new NotFoundException({
    //             success: false,
    //             message: error.message,
    //         })
    //     }
    // }
}
