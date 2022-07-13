import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bull'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
// import { AuthModule } from './auth/auth.module'

import { asyncBullConfigOptions } from './configs/bull.config'
import { cacheConfigAsync } from './configs/cache.config'
import { configOptions } from './configs/config'
import { asyncGraphqlConfig } from './configs/graphql.config'
import { asyncMailOptions } from './configs/mail.config'
import { asyncThrottlerOptions } from './configs/throttle.config'
import { PrismaService } from './prisma/prisma.service'
import { ThreadModule } from './thread/thread.module'

@Module({
    imports: [
        CacheModule.registerAsync(cacheConfigAsync),
        ConfigModule.forRoot(configOptions),
        GraphQLModule.forRootAsync(asyncGraphqlConfig),
        ThrottlerModule.forRootAsync(asyncThrottlerOptions),
        MailerModule.forRootAsync(asyncMailOptions),
        BullModule.forRootAsync(asyncBullConfigOptions),
        AuthModule,
        ThreadModule,
    ],
    providers: [PrismaService],
})
export class AppModule {}
