import { Module } from '@nestjs/common'
import { NotificationService } from './services/notifications.service'
import { NotificationsResolver } from './resolvers/notifications.resolver'
import { PrismaService } from '../prisma_service/prisma.service'
import { NotificationController } from './controllers/notification.controller'
import { ClientsModule } from '@nestjs/microservices'
import { GrpcClientOptions } from '../configs/GrpcClientOptions'
import { ApplicationService } from './services/application.service'
import { HealthService } from './services/heath.service'

@Module({
    imports: [ClientsModule.register(GrpcClientOptions)],
    providers: [
        NotificationsResolver,
        NotificationService,
        ApplicationService,
        HealthService,
        PrismaService,
    ],
    controllers: [NotificationController],
})
export class NotificationsModule {}
