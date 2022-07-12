import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
//@ts-ignore
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { cacheConfigAsync } from '../configs/cache.config';
import { JwtStrategy } from '../providers/JwtStrategy';
import { asyncJwtOptions } from '../configs/jwt.config';

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
