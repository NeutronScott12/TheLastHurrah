import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { BullQueueBaseMethods } from '@thelasthurrah/the-last-hurrah-shared'
import { Job } from 'bull'
import {
    SEND_EMAIL_TO_SUBSCRIBED_USERS,
    THREAD_EMAIL_QUEUE,
} from 'src/constants'
import { ThreadEmailService } from '../services/thread-email.service'
import { ISendEmailToThreadSubscribersArgs } from '../types'

@Processor(THREAD_EMAIL_QUEUE)
export class ThreadEmailConsumer extends BullQueueBaseMethods {
    logger = new Logger(this.constructor.name)

    constructor(private readonly threadEmailService: ThreadEmailService) {
        super()
    }

    @Process(SEND_EMAIL_TO_SUBSCRIBED_USERS)
    async sendEmailToSubscribedUsers(
        job: Job<ISendEmailToThreadSubscribersArgs>,
    ) {
        try {
            await this.threadEmailService.sendEmailToThreadSubscribers(job.data)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
