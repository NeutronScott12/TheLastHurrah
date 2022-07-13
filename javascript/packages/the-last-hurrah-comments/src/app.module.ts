import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { TerminusModule } from '@nestjs/terminus'
import { MailerModule } from '@nestjs-modules/mailer'

import { AppController } from './app.controller'
import { CommentModule } from './comment/comment.module'
import { configOptions } from './configs/config'
import { PrismaService } from './prisma/prisma.service'
import { GraphqlOptionsAsync } from './configs/graphql.config'
import { bullConfigOptionAsync } from './configs/bull.config'
import { ClientsModule } from '@nestjs/microservices'
import { GrpcClientOptions } from './configs/GrpcClient.config'
import { AsyncMailOptions } from './configs/mail.config'

import * as redisStore from 'cache-manager-redis-store'
import { cacheConfigAsync } from './configs/cache.config'
import { AuthModule } from './auth/auth.module'
@Module({
    imports: [
        CacheModule.registerAsync(cacheConfigAsync),
        MailerModule.forRootAsync(AsyncMailOptions),
        ConfigModule.forRoot(configOptions),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        TerminusModule,
        AuthModule,
        CommentModule,
        BullModule.forRootAsync(bullConfigOptionAsync),
        GraphQLModule.forRootAsync(GraphqlOptionsAsync),
        ClientsModule.register(GrpcClientOptions),
    ],
    controllers: [AppController],
    providers: [PrismaService],
})
export class AppModule {}
