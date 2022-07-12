import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@thelasthurrah/the-last-hurrah-shared'

import { JWT_SECRET } from '../constants'
import { PrismaService } from '../prisma/prisma.service'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import * as redisStore from 'cache-manager-redis-store'

// import { jwtConstants } from './constants';

@Module({
    imports: [
        // UsersModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        // CacheModule.register({
        //     // isGlobal: true,
        //     store: redisStore,
        //     // host: configService.get('REDIS_HOST'),
        //     // port: configService.get('REDIS_PORT'),
        // }),
        HttpModule,
    ],
    providers: [JwtStrategy, PrismaService, ConfigService],
    exports: [],
})
export class AuthModule {}
