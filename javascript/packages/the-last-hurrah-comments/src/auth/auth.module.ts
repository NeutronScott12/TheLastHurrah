import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule } from '@nestjs/microservices'
//@ts-ignore
import { asyncJwtOptions } from 'src/configs/jwt.config'
import { ConfigService } from '@nestjs/config'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { JwtStrategy } from './JwtStrategy'
import { ApplicationService } from 'src/comment/services/application.service'
import { GrpcClientOptions } from '../configs/GrpcClient.config'

@Module({
    imports: [
        // TypeOrmModule.forFeature([UserModel]),
        ClientsModule.register(GrpcClientOptions),
        PassportModule,
        JwtModule.registerAsync(asyncJwtOptions),
        CacheModule.registerAsync(cacheConfigAsync),
    ],
    providers: [JwtStrategy, ConfigService, ConfigService, ApplicationService],
})
export class AuthModule {}
