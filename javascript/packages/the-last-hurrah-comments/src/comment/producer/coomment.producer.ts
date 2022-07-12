import { InjectQueue } from '@nestjs/bull'
import { InternalServerErrorException } from '@nestjs/common'
import { Queue } from 'bull'
import {
    APPLICATION_QUEUE,
    COMMENT_QUEUE,
    REPLY_COMMENT_EMAIL,
    UPDATE_APPLICATION_COMMENTERS_USERS_IDS,
} from 'src/constants'
import {
    IReplyCommentEmailArgs,
    IUpdateCommentersUserIdsArgs,
} from './producer-types'

export class CommentQueueProducer {
    constructor(
        @InjectQueue(APPLICATION_QUEUE) private applicationQueue: Queue,
        @InjectQueue(COMMENT_QUEUE) private commentQueue: Queue,
    ) {}

    async update_application_commenters_users_ids(
        args: IUpdateCommentersUserIdsArgs,
    ) {
        try {
            await this.applicationQueue.add(
                UPDATE_APPLICATION_COMMENTERS_USERS_IDS,
                args,
            )
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async reply_comment_email(args: IReplyCommentEmailArgs) {
        try {
            await this.commentQueue.add(REPLY_COMMENT_EMAIL, args)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
