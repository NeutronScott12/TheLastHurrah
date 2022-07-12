import { InternalServerErrorException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PrismaService } from 'src/prisma/prisma.service'

import { ApproveCommentsInput } from '../dto/inputs/approve-comment.input'
import { StandardResponseModel } from '../models/standard-response.model'
import { CommentService } from '../services/comment.service'

@Resolver()
export class ModerationResolver {
    constructor(
        private readonly commentService: CommentService,
        private readonly prisma: PrismaService,
    ) {}

    @Mutation(() => StandardResponseModel)
    async approve_comments(
        @Args('approveCommentsInput') { comment_ids }: ApproveCommentsInput,
    ) {
        try {
            await this.commentService.updateMany({
                where: { id: { in: comment_ids } },
                data: {
                    pending: false,
                    approved: true,
                    flagged: false,
                },
            })

            await this.prisma.report.deleteMany({
                where: { commentId: { in: comment_ids } },
            })

            return {
                success: true,
                message: 'Successfully approved',
            }
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
