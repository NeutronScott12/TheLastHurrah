import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import {
    SEND_EMAIL_TO_SUBSCRIBED_USERS,
    THREAD_EMAIL_QUEUE,
} from 'src/constants'
import { ISendEmailToThreadSubscribersArgs } from '../types'

@Injectable()
export class ThreadEmailProducer {
    constructor(
        @InjectQueue(THREAD_EMAIL_QUEUE) private authEmailQueue: Queue,
    ) {}

    async sendEmailToSubscribersUserProducer(
        args: ISendEmailToThreadSubscribersArgs,
    ) {
        await this.authEmailQueue.add(SEND_EMAIL_TO_SUBSCRIBED_USERS, args)
    }
}
