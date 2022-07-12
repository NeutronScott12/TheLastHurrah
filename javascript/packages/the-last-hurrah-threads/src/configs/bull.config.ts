import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configOptions } from './config'

class BullConfigOptions {
    static getBullConfig(configService: ConfigService): BullModuleOptions {
        return {
            redis: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            },
        }
    }
}

export const asyncBullConfigOptions: SharedBullAsyncConfiguration = {
    imports: [ConfigModule.forRoot(configOptions)],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
        BullConfigOptions.getBullConfig(configService),
}
