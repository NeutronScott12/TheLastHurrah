import { BullModuleOptions, SharedBullAsyncConfiguration } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configOptions } from '.'

class bullConfigOptions {
    static getBullConfig(configService: ConfigService): BullModuleOptions {
        return {
            //@ts-ignore
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
