import { Module } from '@nestjs/common'
import { GqlAuthGuard } from '@thelasthurrah/the-last-hurrah-shared'
import { APP_GUARD } from '@nestjs/core'
import { BullModule } from '@nestjs/bull'
import { ClientsModule } from '@nestjs/microservices'

import { ThreadService } from './services/thread.service'
import { ThreadResolver } from './resolvers/thread.resolver'
import { PrismaService } from '../prisma/prisma.service'
import { ThreadController } from './controllers/thread.controller'
import { PollService } from './services/poll.service'
import { PollResolver } from './resolvers/poll.resolver'
import { ThreadEmailService } from './services/thread-email.service'
import { ThreadEmailProducer } from './producer/thread-email.producer'
import { ThreadEmailConsumer } from './consumer/thread-email.consumer'
import { THREAD_EMAIL_QUEUE } from '../constants'
import { UserGrpcService } from './services/user-grpc.service'
import { ApplicationResolver } from './resolvers/application.resolver'
import { grpClient } from '../configs/grpc.config'
import { ApplicationGrpcService } from './services/application-grpc.service'
import { CommentGrpcService } from './services/comment.grpc.service'

@Module({
    providers: [
        { provide: APP_GUARD, useClass: GqlAuthGuard },
        ThreadResolver,
        ThreadService,
        ThreadEmailService,
        UserGrpcService,
        ThreadEmailProducer,
        ThreadEmailConsumer,
        PollResolver,
        PollService,
        ApplicationResolver,
        ApplicationGrpcService,
        PrismaService,
        CommentGrpcService,
    ],
    imports: [
        ClientsModule.register(grpClient),
        BullModule.registerQueue({ name: THREAD_EMAIL_QUEUE }),
    ],
    controllers: [ThreadController],
})
export class ThreadModule {}
