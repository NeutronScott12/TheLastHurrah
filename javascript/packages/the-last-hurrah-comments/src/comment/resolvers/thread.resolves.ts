import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { CommentService } from '../services/comment.service'
import { FetchCommentByThreadIdResponse } from '../dto/responses/fetch_comments_by_thread_id.response'
import { ThreadModel } from '../models/thread.entity'
import { CommentsArgsIncludes } from 'src/utils/validation/config'
import { generateOrderBy } from 'src/helpers'
import { CommentModel } from '../models/comment.model'
import { NotFoundException } from '@nestjs/common'
import { CommentsByUserIdInput } from '../dto/inputs/comments-by-user-id.input'
import { Prisma } from '@prisma/client'
import { FetchThreadCommentsBySort } from '../dto/inputs/fetch_comments_by_thread_id.input'

@Resolver(() => ThreadModel)
export class ThreadResolver {
    constructor(private readonly commentService: CommentService) {}

    // @ResolveField('pinned_comment', () => CommentModel, { nullable: true })
    // public async getPinnedComment(
    //     @Parent() { pinned_comment_id }: ThreadModel,
    // ) {
    //     try {
    //         if (pinned_comment_id) {
    //             return await this.commentService.findOneById({
    //                 where: { id: pinned_comment_id },
    //             })
    //         } else {
    //             return null
    //         }
    //     } catch (error) {
    //         throw new NotFoundException({
    //             success: false,
    //             message: error.message,
    //         })
    //     }
    // }

    @ResolveField('thread_comments', () => FetchCommentByThreadIdResponse)
    public async getThreadComments(
        @Parent() { id }: ThreadModel,
        @Args('commentsByUserIdInput', { nullable: true })
        args: CommentsByUserIdInput,
        @Args('fetchThreadCommentsBySort')
        { skip, limit, sort }: FetchThreadCommentsBySort,
    ) {
        let orderBy = generateOrderBy(sort)

        const where: Prisma.CommentFindManyArgs = {
            skip,
            take: limit,
            orderBy,
            include: CommentsArgsIncludes,
        }

        if (args && args.user_id) {
            return this.commentService.findAll(
                {
                    where: {
                        AND: {
                            thread_id: id,
                            user_id: args.user_id,
                            deleted: false,
                        },
                    },
                    ...where,
                },
                id,
            )
        }

        const response = await this.commentService.findAll(
            {
                where: {
                    AND: {
                        thread_id: id,
                        parent_id: { equals: null },
                    },
                },
                ...where,
            },
            id,
        )

        // console.log('RESPONSE', response)

        return response
    }
}
