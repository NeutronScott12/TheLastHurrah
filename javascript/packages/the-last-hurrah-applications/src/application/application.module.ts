import { Module } from '@nestjs/common'
// import * as redisStore from 'cache-manager-redis-store'

import { ApplicationService } from './services/application.service'
import { ApplicationResolver } from './resolvers/application.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from '@thelasthurrah/the-last-hurrah-shared'
import { ApplicationController } from './controllers/application.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ApplicationProducer } from './producers/application.producer'
import { BullModule } from '@nestjs/bull'
import { ApplicationConsumer } from './comsumer/application.consumer'
import { UserGrpcService } from './services/user-grpc.service'
import { grpClient } from 'src/configs/grpClient.config'
import { ThreadGrpcService } from './services/thread-grpc.service'
import { CommenceGrpcService } from './services/commence.grpc.service'
import { SubscriptionResolver } from './resolvers/subscription.resolver'
import { SubscriptionService } from './services/subscription.service'

@Module({
    providers: [
        { provide: APP_GUARD, useClass: GqlAuthGuard },
        ApplicationResolver,
        ApplicationService,
        SubscriptionResolver,
        SubscriptionService,
        PrismaService,
        UserGrpcService,
        ThreadGrpcService,
        CommenceGrpcService,
        ApplicationProducer,
        ApplicationConsumer,
    ],
    imports: [
        // CacheModule.register({
        //     store: redisStore,
        //     host: 'localhost',
        //     port: '6379',
        // }),
        ClientsModule.register(grpClient),
        BullModule.registerQueue({ name: 'comment_queue' }),
        BullModule.registerQueue({ name: 'application_queue' }),
        ClientsModule.register([
            {
                name: 'APPLICATION_SERVICE',
                transport: Transport.TCP,
            },
        ]),
    ],
    controllers: [ApplicationController],
})
export class ApplicationModule {}
