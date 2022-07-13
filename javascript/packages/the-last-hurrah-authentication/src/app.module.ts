import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MailerModule } from '@nestjs-modules/mailer'

import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { configOptions } from './configs'
import { ThrottlerModule } from '@nestjs/throttler'
import { AsyncGraphqlOptions } from './configs/graphql.config'
import { AsyncMailOptions } from './configs/mailer.config'
import { BullModule } from '@nestjs/bull'
import { bullConfigOptionAsync } from './configs/bull.config'
// import { AuthModule } from './auth/auth.module'
import { cacheConfigAsync } from './configs/cache.config'
// import { AuthModule } from '@thelasthurrah/the-last-hurrah-shared'

import * as redisStore from 'cache-manager-redis-store'
import { AuthModule } from './auth/auth.module'
// import { AuthModule } from '@thelasthurrah/the-last-hurrah-shared'

@Module({
    imports: [
        CacheModule.registerAsync(cacheConfigAsync),
        MailerModule.forRootAsync(AsyncMailOptions),
        ConfigModule.forRoot(configOptions),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        UserModule,
        AuthModule,
        BullModule.forRootAsync(bullConfigOptionAsync),
        GraphQLModule.forRootAsync(AsyncGraphqlOptions),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
