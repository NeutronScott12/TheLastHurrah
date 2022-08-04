import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

import { asyncJwtOptions } from 'src/configs/jwt.config'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { JwtStrategy } from './JwtStrategy'
import { grpClient } from '../configs/grpc.config'
import { ApplicationGrpcService } from '../thread/services/application-grpc.service'

@Module({
    imports: [
        PassportModule,
        ClientsModule.register(grpClient),
        JwtModule.registerAsync(asyncJwtOptions),
        CacheModule.registerAsync(cacheConfigAsync),
        HttpModule,
    ],
    providers: [JwtStrategy, ConfigService, ApplicationGrpcService],
})
export class AuthModule {}
