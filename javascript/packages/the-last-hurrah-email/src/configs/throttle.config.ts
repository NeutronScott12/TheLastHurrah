import {
    ThrottlerAsyncOptions,
    ThrottlerModuleOptions,
} from '@nestjs/throttler'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configOptions } from './config'

class ThrottlerOptions {
    static getThrottlerOptions(
        configService: ConfigService,
    ): ThrottlerModuleOptions {
        return {
            ttl: configService.get('THROTTLE_TTL'),
            limit: configService.get('THROTTLE_LIMIT'),
            ignoreUserAgents: [new RegExp('bingbot', 'gi')],
        }
    }
}

export const asyncThrottlerOptions: ThrottlerAsyncOptions = {
    imports: [ConfigModule.forRoot(configOptions)],
    inject: [ConfigService],
    useFactory: (configService) =>
        ThrottlerOptions.getThrottlerOptions(configService),
}
