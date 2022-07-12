import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthController } from './auth.controller'
import { JWT_SECRET } from 'src/contants'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthService } from './auth.service'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [PrismaService, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
