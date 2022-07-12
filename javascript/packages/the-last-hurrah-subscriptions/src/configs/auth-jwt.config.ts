import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt'

import { JWT_SECRET } from 'src/constants'
import { configOptions } from './config'

class JwtAuthOptions {
    static getJwtOptions(configService: ConfigService): JwtModuleOptions {
        return {
            secret: configService.get(JWT_SECRET),
            signOptions: { expiresIn: '7d' },
        }
    }
}

export const jwtAsyncOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: (configService: ConfigService) =>
        JwtAuthOptions.getJwtOptions(configService),
    inject: [ConfigService],
}
