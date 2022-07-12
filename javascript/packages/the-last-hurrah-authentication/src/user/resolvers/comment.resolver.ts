import { NotAcceptableException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { CommentModel } from '../entities/comment.entity'
import { UserModel } from '../entities/user.entity'
import { UserService } from '../services/user.service'

@Resolver((of) => CommentModel)
export class CommentResolver {
    constructor(private userService: UserService) {}

    @ResolveField('replied_to_user', (of) => UserModel, { nullable: true })
    async getRepliedToUser(@Parent() { replied_to_id }: CommentModel) {
        try {
            if (replied_to_id) {
                const response = await this.userService.findUser({
                    where: {
                        id: replied_to_id,
                    },
                })

                return response
            } else {
                return null
            }
        } catch (error) {
            throw new NotAcceptableException({
                success: false,
                message: error.message,
            })
        }
    }
}
