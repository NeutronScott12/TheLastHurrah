import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { SET_TIMEOUT_THREAD_CLOSE, THREAD_TASK_QUEUE } from '~/constants'
import { ISetThreadCloseArgs } from '../types'

@Injectable()
export class ThreadTaskProducer {
    constructor(
        @InjectQueue(THREAD_TASK_QUEUE) private threadTaskQueue: Queue,
    ) {}

    async setThreadClose(args: ISetThreadCloseArgs, delay: number) {
        console.log('PRODUCER STARTED')
        await this.threadTaskQueue.add(SET_TIMEOUT_THREAD_CLOSE, args, {
            delay,
        })
        console.log('PRODUCER EXITED')
    }
}
