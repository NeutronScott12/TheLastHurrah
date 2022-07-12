import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { EMAIL_QUEUE } from 'src/constants'

import { EmailConsumer } from './consumers/email.consumer'
import { GrpcEmailController } from './controllers/email-grpc.controller'
import { EmailService } from './services/email.service'
import { GrpcEmailService } from './services/grpc-email.service'

@Module({
    providers: [GrpcEmailService, EmailService, EmailConsumer],
    imports: [BullModule.registerQueue({ name: EMAIL_QUEUE })],
    controllers: [GrpcEmailController],
})
export class EmailModule {}
