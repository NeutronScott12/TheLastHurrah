import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
//@ts-ignore
import { asyncJwtOptions } from 'src/configs/jwt.config'
import { ConfigService } from '@nestjs/config'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { JwtStrategy } from '@thelasthurrah/the-last-hurrah-shared'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync(asyncJwtOptions),
        CacheModule.registerAsync(cacheConfigAsync),
        HttpModule,
    ],
    providers: [JwtStrategy, ConfigService],
})
export class AuthModule {}
