import { ConfigModule, ConfigService } from '@nestjs/config'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import {
    ApolloFederationDriver,
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { join } from 'path'
import Redis from 'ioredis'
import { configOptions } from './config'

class GQLModuleOptions {
    static getGqlOptions(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        return {
            cache: new BaseRedisCache({
                client: new Redis({
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                }),
            }),
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            debug: configService.get('GRAPHQL_DEBUG'),
            playground: configService.get('GRAPHQL_PLAYGROUND'),
            introspection: configService.get('GRAPHQL_INTROSPECTION'),
            context: ({ req }) => {
                return {
                    req,
                }
            },
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
            },
        }
    }
}

export const GqlOptionsAsync: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) =>
        GQLModuleOptions.getGqlOptions(configService),
}
