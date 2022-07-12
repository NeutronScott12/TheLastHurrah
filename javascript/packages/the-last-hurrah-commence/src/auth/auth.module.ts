import { CacheModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { PrismaService } from '../prisma/prisma.service'
import { JWT_SECRET } from '../constants'
import { cacheConfigAsync } from 'src/configs/cache.config'
import { JwtStrategy } from '@thelasthurrah/the-last-hurrah-shared'
import { ConfigService } from '@nestjs/config'

// import { jwtConstants } from './constants';

@Module({
    imports: [
        // UsersModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        CacheModule.registerAsync(cacheConfigAsync),
    ],
    providers: [JwtStrategy, PrismaService, ConfigService],
    exports: [],
})
export class AuthModule {}
