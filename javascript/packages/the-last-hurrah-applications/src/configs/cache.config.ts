import { CacheModuleAsyncOptions, CacheModuleOptions } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'

class CacheConfig {
    static getCacheConfig(configService: ConfigService): CacheModuleOptions {
        return {
            isGlobal: true,
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        }
    }
    a
}

export const cacheConfigAsync: CacheModuleAsyncOptions = {
    imports: [ConfigService],
    useFactory: (ConfigService: ConfigService) =>
        CacheConfig.getCacheConfig(ConfigService),
    inject: [ConfigService],
}
