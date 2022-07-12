import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { UserService } from './user.service'

@Injectable()
export class CommentEmailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly userService: UserService,
    ) {}

    async replyCommentEmail(email: string, username: string) {
        try {
            await this.mailService.sendMail({
                to: email,
                from: 'Binarystash.co.uk',
                subject: 'Comemnt reported',
                text: `${username} has replied to your comment`,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async sendEmailToModerators(
        moderators: string[],
        comment_id: string,
        thread_title: string,
        website_url: string,
    ) {
        try {
            const response = await this.userService.getUsersById({
                user_ids: moderators,
            })

            response.users.forEach((moderator) => {
                this.mailService.sendMail({
                    to: moderator.email,
                    from: 'Binarystash.co.uk',
                    subject: 'Comemnt reported',
                    text: `Comment [${comment_id}] was reported in ${thread_title} - ${website_url}`,
                })
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
