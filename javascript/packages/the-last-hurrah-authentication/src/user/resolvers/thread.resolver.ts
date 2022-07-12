import { InternalServerErrorException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ThreadModel } from '../entities/thread.entity'
import { UserModel } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@Resolver((of) => ThreadModel)
export class ThreadResolver {
    constructor(private readonly userService: UserService) {}

    @ResolveField('subscribed_users', (of) => [UserModel])
    async subscribed_users(@Parent() { subscribed_users_ids }: ThreadModel) {
        try {
            return this.userService.findUsers({
                where: { id: { in: subscribed_users_ids } },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    // @Mutation()
    // async add_thread_to_recommendation(@Args("AddThreadToRecommendationInput") {}: ) {
    //     try {

    //     } catch (error) {
    //         throw new NotAcceptableException({success: false, message: error.message})
    //     }
    // }
}
