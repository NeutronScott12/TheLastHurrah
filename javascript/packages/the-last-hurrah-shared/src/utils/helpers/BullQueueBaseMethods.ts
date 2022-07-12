import { OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export class BullQueueBaseMethods {
    logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Processing job ${job.id} of type ${
                job.name
            }. Data: ${JSON.stringify(job.data)}`,
        );
    }

    @OnQueueCompleted()
    async onComplete(job: Job, result: any) {
        this.logger.debug(
            `Completed job ${job.id} of type ${
                job.name
            }. Result: ${JSON.stringify(result)}`,
        );

        if (await job.isCompleted()) {
            await job.remove();
        }
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(
            `Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        );
    }
}
