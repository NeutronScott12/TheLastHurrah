import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from '@thelasthurrah/the-last-hurrah-shared'

import { asyncBullConfigOptions } from './configs/bull.config'
import { configOptions } from './configs/config'
import { asyncGraphqlConfig } from './configs/graphql.config'
import { asyncMailOptions } from './configs/mail.config'
import { asyncThrottlerOptions } from './configs/throttle.config'
import { PrismaService } from './prisma/prisma.service'

@Module({
    imports: [
        ConfigModule.forRoot(configOptions),
        GraphQLModule.forRootAsync(asyncGraphqlConfig),
        ThrottlerModule.forRootAsync(asyncThrottlerOptions),
        MailerModule.forRootAsync(asyncMailOptions),
        BullModule.forRootAsync(asyncBullConfigOptions),
        AuthModule,
    ],
    providers: [PrismaService],
})
export class AppModule {}
