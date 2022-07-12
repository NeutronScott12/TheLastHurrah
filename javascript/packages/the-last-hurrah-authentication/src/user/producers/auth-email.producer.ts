import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import {
    AUTH_EMAIL_QUEUE,
    SEND_CHANGE_PASSWORD_EMAIL_QUEUE,
    SEND_CONFIRMATION_EMAIL_QUEUE,
    SEND_EMAIL_UNKNOWN_CLIENT_LOGIN,
    SEND_TWO_FACTOR_EMAIL_QUEUE,
} from '../../constants'
import {
    IUnknownClientLoginArgs,
    IUserEmailArgs,
    TwoFactorArgs,
} from '../types'

@Injectable()
export class AuthEmailProducer {
    constructor(@InjectQueue(AUTH_EMAIL_QUEUE) private authEmailQueue: Queue) {}

    async sendConfirmationEmailQueue(args: IUserEmailArgs) {
        await this.authEmailQueue.add(SEND_CONFIRMATION_EMAIL_QUEUE, args)
    }

    async sendChangePasswordEmailQueue(args: IUserEmailArgs) {
        await this.authEmailQueue.add(SEND_CHANGE_PASSWORD_EMAIL_QUEUE, args)
    }

    async sendTwoFactorIdEmail(args: TwoFactorArgs) {
        await this.authEmailQueue.add(SEND_TWO_FACTOR_EMAIL_QUEUE, args)
    }

    async sendEmailUnknownClientLogin(args: IUnknownClientLoginArgs) {
        await this.authEmailQueue.add(SEND_EMAIL_UNKNOWN_CLIENT_LOGIN, args)
    }
}
