import { InternalServerErrorException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { CommentModel } from '../models/comment.model'
import { ProfileEntity } from '../models/profile.entity'
import { CommentService } from '../services/comment.service'

@Resolver(() => ProfileEntity)
export class ProfileResolver {
    constructor(private readonly commentService: CommentService) {}

    @ResolveField('profile_comments', (of) => [CommentModel])
    async get_profile_comemnts(@Parent() { id }: ProfileEntity) {
        try {
            const comments = await this.commentService.findAll({
                where: { AND: { user_id: id, deleted: false } },
            })

            return comments.comments
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
