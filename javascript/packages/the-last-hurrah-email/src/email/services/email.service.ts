import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ISendEmailArgs } from '../proto/email-grpc.types'

@Injectable()
export class EmailService {
    constructor(private readonly emailService: MailerService) {}

    async sendEmail(args: ISendEmailArgs) {
        try {
            await this.emailService.sendMail({
                ...args,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
