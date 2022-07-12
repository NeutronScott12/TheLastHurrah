import { InternalServerErrorException } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'
import { AuthenticatedUserInput } from '../dto/inputs/authenticated-users.input'
import { ApplicationModel } from '../entities/application.entity'
import { UserModel } from '../entities/user.entity'
import { generateUserWhere } from '../helpers'
import { UserService } from '../services/user.service'

@Resolver((of) => ApplicationModel)
export class ApplicationResolver {
    constructor(private readonly userService: UserService) {}

    @ResolveField('moderators', (of) => [UserModel])
    public async getApplicationModerators(
        @Parent() { moderators_ids }: ApplicationModel,
    ) {
        const response = this.userService.findUsers({
            where: {
                id: { in: moderators_ids },
            },
        })

        return response
    }

    @ResolveField('authenticated_users', (of) => [UserModel])
    async getAuthenticatedUsers(
        @Args('authenticatedUserInput')
        { choice, skip, limit }: AuthenticatedUserInput,
        @Parent()
        { authenticated_users_ids, banned_users_by_id }: ApplicationModel,
    ) {
        try {
            const where = generateUserWhere({
                choice,
                authenticated_users_ids,
                banned_users_by_id,
            })
            const result = await this.userService.findUsers({
                where,
                skip,
                take: limit,
            })

            return result
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
