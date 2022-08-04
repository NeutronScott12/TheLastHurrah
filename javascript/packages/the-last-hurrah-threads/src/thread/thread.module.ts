import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { BullModule } from '@nestjs/bull'
import { ClientsModule } from '@nestjs/microservices'
import { ScheduleModule } from '@nestjs/schedule'

import { ThreadService } from './services/thread.service'
import { ThreadResolver } from './resolvers/thread.resolver'
import { PrismaService } from '../prisma/prisma.service'
import { ThreadController } from './controllers/thread.controller'
import { PollService } from './services/poll.service'
import { PollResolver } from './resolvers/poll.resolver'
import { ThreadEmailService } from './services/thread-email.service'
import { ThreadEmailProducer } from './producer/thread-email.producer'
import { ThreadEmailConsumer } from './consumer/thread-email.consumer'
import { THREAD_EMAIL_QUEUE, THREAD_TASK_QUEUE } from '../constants'
import { UserGrpcService } from './services/user-grpc.service'
import { ApplicationResolver } from './resolvers/application.resolver'
import { grpClient } from '../configs/grpc.config'
import { ApplicationGrpcService } from './services/application-grpc.service'
import { CommentGrpcService } from './services/comment.grpc.service'
import { ThreadTaskProducer } from './producer/thread-task.producer'
import { GqlAuthGuard } from '~/decorators/GqlAuthGuard'

@Module({
    providers: [
        { provide: APP_GUARD, useClass: GqlAuthGuard },
        ThreadResolver,
        ThreadService,
        ThreadEmailService,
        UserGrpcService,
        ThreadEmailProducer,
        ThreadEmailConsumer,
        ThreadTaskProducer,
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
        BullModule.registerQueue({ name: THREAD_TASK_QUEUE }),
        ScheduleModule.forRoot(),
    ],
    controllers: [ThreadController],
})
export class ThreadModule {}
