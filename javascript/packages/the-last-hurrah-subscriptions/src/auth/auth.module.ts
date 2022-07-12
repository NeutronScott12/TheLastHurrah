import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
//@ts-ignore
import { JwtStrategy } from './jwt.strategy'
import { jwtAsyncOptions } from 'src/configs/auth-jwt.config'

@Module({
    imports: [
        // TypeOrmModule.forFeature([UserModel]),
        PassportModule,
        JwtModule.registerAsync(jwtAsyncOptions),
    ],
    providers: [JwtStrategy],
})
export class AuthModule {}
