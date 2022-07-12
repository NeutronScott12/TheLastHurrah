import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
//@ts-ignore
import { JwtStrategy } from './jwt.strategy'
import { asyncJwtOptions } from 'src/configs/jwt.config'
import { ConfigService } from '@nestjs/config'

@Module({
    imports: [PassportModule, JwtModule.registerAsync(asyncJwtOptions)],
    providers: [JwtStrategy, ConfigService],
})
export class AuthModule {}
