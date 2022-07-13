import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ClientsModule } from '@nestjs/microservices'
import { ThrottlerModule } from '@nestjs/throttler'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApplicationModule } from './application/application.module'
import { configOptions } from './configs/config'
import { bullConfigOptionAsync } from './configs/bull.config'
import { graphqlOptionsAsync } from './configs/graphql.config'
import { grpClient } from './configs/grpClient.config'
import { AsyncMailOptions } from './configs/mailer.config'
import { PrismaService } from './prisma/prisma.service'

import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        MailerModule.forRootAsync(AsyncMailOptions),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        AuthModule,
        ApplicationModule,
        BullModule.forRootAsync(bullConfigOptionAsync),
        ConfigModule.forRoot(configOptions),
        GraphQLModule.forRootAsync(graphqlOptionsAsync),
        ClientsModule.register(grpClient),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
