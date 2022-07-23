import { Comment } from '.prisma/client'
import {
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common'

import { ApplicationService } from 'src/comment/services/application.service'
import { CommentService } from 'src/comment/services/comment.service'
import { INVALID_CREDENTIALS } from 'src/constants'

interface ICommentPermissions {
    commentService: CommentService
    applicationService: ApplicationService
    comment_id: string
    comment_ids: string[]
    user_id: string
}

export const commentPersissions = async <R>(
    {
        commentService,
        applicationService,
        user_id,
        comment_id,
        comment_ids,
    }: ICommentPermissions,
    callback: () => R,
): Promise<R> => {
    let comment: Comment
    try {
        if (comment_id) {
            comment = await commentService.findOneById({
                where: { id: comment_id },
            })
        }

        if (comment_ids) {
            comment = await commentService.findOneById({
                where: { id: comment_ids[0] },
            })
        }

        const response = await applicationService.getApplicationById(
            comment.application_id,
        )

        if (response.application_owner_id === user_id) {
            return callback()
        } else if (
            response.moderators_ids &&
            response.moderators_ids.find((id) => id === user_id)
        ) {
            return callback()
        } else if (comment.user_id === user_id) {
            return callback()
        } else {
            throw new UnauthorizedException({
                success: false,
                message: INVALID_CREDENTIALS,
            })
        }
    } catch (error) {
        throw new InternalServerErrorException({
            success: false,
            message: error.message,
        })
    }
}
