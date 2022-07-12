import { NotFoundException } from '@nestjs/common'
import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql'
import { FindProfileInput } from '../dto/inputs/find-profile.input'
import { ProfileEntity } from '../entities/profile.entity'
import { UserService } from '../services/user.service'

@Resolver()
export class ProfileResolver {
    constructor(private readonly userService: UserService) {}

    @ResolveReference()
    async resolveReference(reference: {
        __typename: string
        id: string
    }): Promise<ProfileEntity> {
        const user = await this.userService.findUniqueUser({
            where: {
                id: reference.id,
            },
        })

        return {
            id: user.id,
            //@ts-ignore
            user,
        }
    }

    @Query(() => ProfileEntity)
    async find_profile(
        @Args('findProfileInput') { username }: FindProfileInput,
    ): Promise<ProfileEntity> {
        try {
            const user = await this.userService.findUser({
                where: { username },
                include: { avatar: true, blocked_users: true },
            })

            return {
                id: user.id,
                //@ts-ignore
                user,
            }
        } catch (error) {
            throw new NotFoundException({
                success: false,
                message: error.message,
            })
        }
    }
}
