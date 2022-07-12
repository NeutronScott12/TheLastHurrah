import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ISendEmailToThreadSubscribersArgs } from '../types'

@Injectable()
export class ThreadEmailService {
    constructor(private mailService: MailerService) {}

    async sendEmailToThreadSubscribers({
        email,
        thread_url,
        thread_title,
    }: ISendEmailToThreadSubscribersArgs) {
        try {
            await this.mailService.sendMail({
                from: 'Binarystash.co.uk',
                to: email,
                subject: `New comment for ${thread_title}`,
                html: `
                    <h1>New comment for ${thread_title}</h1>
                    <a href="${thread_url}">Thread</p>
                `,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
