import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from '../prisma/prisma.service'
import { JWT_SECRET } from '../constants'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './JwtStrategy'
import { ApplicationService } from '../commence/services/application.service'
import { ClientsModule } from '@nestjs/microservices'
import { grpClient } from '../configs/grpc.config'

// import { jwtConstants } from './constants';

@Module({
    imports: [
        // UsersModule,
        PassportModule,
        ClientsModule.register(grpClient),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        CacheModule.registerAsync(cacheConfigAsync),
    ],
    providers: [JwtStrategy, PrismaService, ConfigService, ApplicationService],
    exports: [],
})
export class AuthModule {}
