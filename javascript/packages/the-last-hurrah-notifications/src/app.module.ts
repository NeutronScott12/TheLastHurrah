import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { configOptions } from './configs/config'
import { GqlOptionsAsync } from './configs/graphql.config'
import { PrismaService } from './prisma_service/prisma.service'
import { NotificationsModule } from './notifications/notifications.module'

@Module({
    imports: [
        ConfigModule.forRoot(configOptions),
        GraphQLModule.forRootAsync(GqlOptionsAsync),
        NotificationsModule,
    ],
    providers: [PrismaService],
})
export class AppModule {}
