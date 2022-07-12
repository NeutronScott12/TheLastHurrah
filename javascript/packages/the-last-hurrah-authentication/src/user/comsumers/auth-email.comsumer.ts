import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { BullQueueBaseMethods } from '@thelasthurrah/the-last-hurrah-shared'
import {
    AUTH_EMAIL_QUEUE,
    SEND_CHANGE_PASSWORD_EMAIL_QUEUE,
    SEND_CONFIRMATION_EMAIL_QUEUE,
    SEND_EMAIL_UNKNOWN_CLIENT_LOGIN,
    SEND_TWO_FACTOR_EMAIL_QUEUE,
} from '../../constants'
import { UserMailService } from '../services/user-mail.service'
import { IUserEmailArgs, TwoFactorArgs } from '../types'

@Processor(AUTH_EMAIL_QUEUE)
export class AuthEmailConsumer extends BullQueueBaseMethods {
    // logger = new Logger(this.constructor.name)

    constructor(private readonly userEmailService: UserMailService) {
        super()
    }

    @Process(SEND_CONFIRMATION_EMAIL_QUEUE)
    async sendConfirmationEmailQueue(job: Job<IUserEmailArgs>) {
        try {
            await this.userEmailService.registrationConfirmationEmail(job.data)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Process(SEND_CHANGE_PASSWORD_EMAIL_QUEUE)
    async sendChangePasswordEmailQueue(job: Job<IUserEmailArgs>) {
        try {
            await this.userEmailService.sendChangePasswordEmail(job.data)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Process(SEND_TWO_FACTOR_EMAIL_QUEUE)
    async sendTwoFactorEmailQueue(job: Job<TwoFactorArgs>) {
        try {
            await this.userEmailService.sendTwoFactorIdEmail(job.data)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    @Process(SEND_EMAIL_UNKNOWN_CLIENT_LOGIN)
    async sendEmailUnknownClientLogin() {
        try {
            // await this.userEmailService.sendEmailUnknownClientLogin({})
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    // @OnQueueActive()
    // onActive(job: Job) {
    //     this.logger.debug(
    //         `Processing job ${job.id} of type ${
    //             job.name
    //         }. Data: ${JSON.stringify(job.data)}`,
    //     )
    // }

    // @OnQueueCompleted()
    // async onComplete(job: Job, result: any) {
    //     this.logger.debug(
    //         `Completed job ${job.id} of type ${
    //             job.name
    //         }. Result: ${JSON.stringify(result)}`,
    //     )

    //     if (await job.isCompleted()) {
    //         await job.remove()
    //     }
    // }

    // @OnQueueFailed()
    // onError(job: Job<any>, error: any) {
    //     this.logger.error(
    //         `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    //         error.stack,
    //     )
    // }
}
