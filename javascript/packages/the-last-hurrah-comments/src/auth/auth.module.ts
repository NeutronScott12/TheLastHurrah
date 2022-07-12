import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
//@ts-ignore
import { asyncJwtOptions } from 'src/configs/jwt.config'
import { ConfigService } from '@nestjs/config'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { JwtStrategy } from '@thelasthurrah/the-last-hurrah-shared'

@Module({
    imports: [
        // TypeOrmModule.forFeature([UserModel]),
        PassportModule,
        JwtModule.registerAsync(asyncJwtOptions),
        CacheModule.registerAsync(cacheConfigAsync),
    ],
    providers: [JwtStrategy, ConfigService, ConfigService],
})
export class AuthModule {}
