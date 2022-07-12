import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import ShortUniqueId from 'short-unique-id'
import { generateUrl } from '@thelasthurrah/the-last-hurrah-shared'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

import {
    IUnknownClientLoginArgs,
    IUserEmailArgs,
    TwoFactorArgs,
} from '../types'
import { CLIENT_URL, TWO_FACTOR_CACHE_KEY } from '../../constants'

@Injectable()
export class UserMailService {
    constructor(
        private mailService: MailerService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async registrationConfirmationEmail({
        email,
        username,
        id,
    }: IUserEmailArgs) {
        try {
            const url = `${this.configService.get(
                CLIENT_URL,
            )}/auth/confirmation`
            const secret = this.configService.get('JWT_SECRET')
            let emailUrl = await generateUrl(
                { email, username, id },
                url,
                secret,
            )
            this.mailService.sendMail({
                from: 'scottberry91@gmail.com',
                to: email,
                subject: 'Confirmation Email',
                html: `
                    <h1>Welcome ${username}, please click the link to confirm</h1>
                    <a href="${emailUrl}">Confirmation Link</p>
                `,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async sendChangePasswordEmail({ username, email, id }: IUserEmailArgs) {
        try {
            const url = `${this.configService.get(
                this.configService.get(CLIENT_URL),
            )}/auth/change_password`
            const secret = this.configService.get('JWT_SECRET')
            let emailUrl = await generateUrl(
                { email, username, id },
                url,
                secret,
            )
            this.mailService.sendMail({
                // from: 'Binarystash.co.uk',
                from: 'scottberry91@gmail.com',
                to: email,
                subject: 'Confirmation Email',
                html: `
                    <h1>Hello ${username}, please click the link to reset password</h1>
                    <a href="${emailUrl}">Reset Link</p>
                `,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async sendTwoFactorIdEmail({ user_id, email }: TwoFactorArgs) {
        try {
            const uid = new ShortUniqueId({ length: 10 })
            const uuid = uid()
            const result = await this.cacheManager.set(
                `${TWO_FACTOR_CACHE_KEY}:${user_id}`,
                uuid,
                {
                    ttl: 1800,
                },
            )

            this.mailService.sendMail({
                // from: 'Binarystash.co.uk',
                from: 'scottberry91@gmail.com',
                to: email,
                subject: 'Two Factor ID',
                html: `
                    Two Factor ID: ${uuid}
                `,
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }

    async sendEmailUnknownClientLogin({
        email,
        user_ip,
    }: IUnknownClientLoginArgs) {
        try {
            this.mailService.sendMail({
                // from: 'Binarystash.co.uk',
                from: 'scottberry91@gmail.com',
                to: email,
                subject: 'Unknown client login',
                html: `
                    There was a login attempt from a new client, we are making sure it was you.
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
