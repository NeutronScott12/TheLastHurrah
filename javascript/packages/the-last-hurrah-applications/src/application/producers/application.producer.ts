import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

export class ApplicationProducer {
    constructor(@InjectQueue('comment_queue') private commentQueue: Queue) {}

    async delete_comments_queue(application_id: string) {
        await this.commentQueue.add('delete_comments', application_id)
    }
}
