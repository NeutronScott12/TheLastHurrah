import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { EMAIL_QUEUE, SEND_EMAIL_QUEUE } from 'src/constants'
import { ISendEmailArgs } from '../proto/email-grpc.types'
import { EmailService } from '../services/email.service'

@Processor(EMAIL_QUEUE)
export class EmailConsumer {
    private readonly logger = new Logger(this.constructor.name)

    constructor(private readonly emailService: EmailService) {}

    @Process(SEND_EMAIL_QUEUE)
    async sendEmailQueue(job: Job<ISendEmailArgs>) {
        try {
            await this.emailService.sendEmail(job.data)
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
