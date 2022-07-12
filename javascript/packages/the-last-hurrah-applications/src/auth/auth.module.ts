import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
import { JwtStrategy } from '@thelasthurrah/the-last-hurrah-shared'

import { JWT_SECRET } from '../constants'
import { UserGrpcService } from 'src/application/services/user-grpc.service'
import { grpClient } from '../configs/grpClient.config'
import { cacheConfigAsync } from '../configs/cache.config'
import { ConfigService } from '@nestjs/config'

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
    ],
    providers: [JwtStrategy, UserGrpcService],
    exports: [],
})
export class AuthModule {}
