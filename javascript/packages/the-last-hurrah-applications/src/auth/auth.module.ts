import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'

import { JWT_SECRET } from '../constants'
import { UserGrpcService } from 'src/application/services/user-grpc.service'
import { grpClient } from '../configs/grpClient.config'
import { cacheConfigAsync } from '../configs/cache.config'
import { ApplicationService } from 'src/application/services/application.service'
import { JwtStrategy } from './JwtStrategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { ApplicationProducer } from 'src/application/producers/application.producer'
import { ThreadGrpcService } from 'src/application/services/thread-grpc.service'
import { BullModule } from '@nestjs/bull'

@Module({
    imports: [
        // UsersModule,
        ClientsModule.register(grpClient),
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        CacheModule.registerAsync(cacheConfigAsync),
        BullModule.registerQueue({ name: 'comment_queue' }),
        BullModule.registerQueue({ name: 'application_queue' }),
    ],
    providers: [
        JwtStrategy,
        UserGrpcService,
        ApplicationService,
        PrismaService,
        ApplicationProducer,
        ThreadGrpcService,
    ],
    exports: [],
})
export class AuthModule {}
