import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { COMMENT_QUEUE, REPLY_COMMENT_EMAIL } from 'src/constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { CommentEmailService } from '../services/email.service'

@Processor(COMMENT_QUEUE)
export class CommentConsumer {
    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly commentMailService: CommentEmailService,
    ) {}

    @Process(REPLY_COMMENT_EMAIL)
    async reply_comment_email({
        data: { email, username },
    }: Job<{ email: string; username: string }>) {
        try {
            await this.commentMailService.replyCommentEmail(email, username)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Process()
    async delete_comments(job: Job<{ application_id: string }>) {
        try {
            await this.prisma.comment.deleteMany({
                where: { application_id: { in: job.data.application_id } },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Process('sendEmailToModerators')
    async sendEmailToModeratorsQueue(
        job: Job<{
            moderators: string[]
            comment_id: string
            thread_title: string
            website_url: string
        }>,
    ) {
        try {
            const { moderators, comment_id, thread_title, website_url } =
                job.data
            await this.commentMailService.sendEmailToModerators(
                moderators,
                comment_id,
                thread_title,
                website_url,
            )
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Processing job ${job.id} of type ${
                job.name
            }. Data: ${JSON.stringify(job.data)}`,
        )
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        this.logger.debug(
            `Completed job ${job.id} of type ${
                job.name
            }. Result: ${JSON.stringify(result)}`,
        )
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(
            `Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        )
    }
}
