import { CacheModuleAsyncOptions, CacheModuleOptions } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'

import { configOptions } from './config'
class CacheConfig {
    static getCacheConfig(configService: ConfigService): CacheModuleOptions {
        return {
            isGlobal: true,
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        }
    }
}

export const cacheConfigAsync: CacheModuleAsyncOptions = {
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: (ConfigService: ConfigService) =>
        CacheConfig.getCacheConfig(ConfigService),
    inject: [ConfigService],
}
