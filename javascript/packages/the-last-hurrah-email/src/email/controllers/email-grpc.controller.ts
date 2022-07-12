import { Controller } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Public } from 'src/decorators/GqlAuthGuard'

import { IActionComplete, ISendEmailArgs } from '../proto/email-grpc.types'
import { EmailService } from '../services/email.service'

@Controller()
export class GrpcEmailController {
    constructor(private emailServiec: EmailService) {}

    @Public()
    @GrpcMethod()
    async sendEmail(args: ISendEmailArgs): Promise<IActionComplete> {
        try {
            if (!args) {
                throw new Error('Invalid Arguments')
            }

            await this.emailServiec.sendEmail(args)

            return {
                success: true,
                message: 'Email successfully sent',
            }
        } catch (error) {
            throw new RpcException({ success: false, message: error.message })
        }
    }
}
