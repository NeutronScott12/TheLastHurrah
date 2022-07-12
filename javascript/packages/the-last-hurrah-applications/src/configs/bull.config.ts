import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull'

import { configOptions } from './config'

class bullConfigOptions {
    static getBullConfig(configService: ConfigService): BullModuleOptions {
        return {
            redis: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            },
        }
    }
}

export const bullConfigOptionAsync: SharedBullAsyncConfiguration = {
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: async (
        configService: ConfigService,
    ): Promise<BullModuleOptions> =>
        bullConfigOptions.getBullConfig(configService),
    inject: [ConfigService],
}
