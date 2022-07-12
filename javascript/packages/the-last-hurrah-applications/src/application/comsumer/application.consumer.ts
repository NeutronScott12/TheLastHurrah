import { Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException } from '@nestjs/common'
import { Job } from 'bull'
import { ApplicationService } from '../services/application.service'
import { IUpdateCommentersUserIdsArgs } from './consumer-types'

@Processor('application_queue')
export class ApplicationConsumer {
    constructor(private readonly applicationService: ApplicationService) {}

    @Process('update_application_commenters_users_ids')
    async update_application_commenters_users_ids({
        data: { application_id, user_id },
    }: Job<IUpdateCommentersUserIdsArgs>) {
        try {
            const application = await this.applicationService.findOneById({
                where: { id: application_id },
            })
            const newList = new Set([
                ...application.commenters_users_ids,
                user_id,
            ])
            return await this.applicationService.updateOne({
                where: {
                    id: application_id,
                },
                data: {
                    commenters_users_ids: { set: Array.from(newList) },
                },
            })
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
