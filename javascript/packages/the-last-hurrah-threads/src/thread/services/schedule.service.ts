import { Injectable } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { ThreadService } from './thread.service'

@Injectable()
export class ScheduleService {
    constructor(
        private scheduleRegistry: SchedulerRegistry,
        private threadService: ThreadService,
    ) {}

    setThreadTimeout(
        thread_title: string,
        thread_id: string,
        milliseconds: number,
    ) {
        const timeout = setTimeout(async () => {
            this.threadService.update({
                where: {
                    id: thread_id,
                },
                data: {
                    thread_closed: true,
                },
            })
        }, milliseconds)
        this.scheduleRegistry.addTimeout(thread_title, timeout)
    }
}
