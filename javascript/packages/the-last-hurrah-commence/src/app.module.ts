import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from '@thelasthurrah/the-last-hurrah-shared'
import * as redisStore from 'cache-manager-redis-store'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommenceModule } from './commence/commence.module'
import { configOptions } from './configs/config'
import { graphqlModuleConfigAsync } from './configs/graphql.config'
import { getSquareAsyncOptions } from './configs/square.config'
import { SquareModule } from './modules/SquareModule/SquareCore'

import { PrismaService } from './prisma/prisma.service'
import { BigIntScalar } from './utils/scalars/BigInt'

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: 'host.docker.internal',
        }),
        SquareModule.forRootAsync(getSquareAsyncOptions),
        ConfigModule.forRoot(configOptions),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        GraphQLModule.forRootAsync(graphqlModuleConfigAsync),
        CommenceModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, BigIntScalar],
})
export class AppModule {}
