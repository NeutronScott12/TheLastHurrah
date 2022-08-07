import { ConfigModule, ConfigService } from '@nestjs/config'
import { GqlModuleAsyncOptions, GqlModuleOptions } from '@nestjs/graphql'
import {
    ApolloFederationDriver,
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import GraphQLJSON from 'graphql-type-json'
import Redis from 'ioredis'
import { join } from 'path'

import { ApplicationModel } from 'src/commence/entities/application.entity'
import { UserModel } from 'src/commence/entities/user.entity'
import { configOptions } from './config'

class GraphqlModuleConfig {
    static getGraphqlModuleConfig(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        // console.log('CONFIG_SERVICE', configService)
        return {
            buildSchemaOptions: {
                orphanedTypes: [UserModel, ApplicationModel],
            },
            cache: new BaseRedisCache({
                client: new Redis({
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                }),
            }),
            autoSchemaFile: {
                path: join(process.cwd(), 'src/schema.gql'),
                federation: { version: 2 },
            },
            debug: configService.get('GRAPHQL_DEBUG'),
            playground: configService.get('GRAPHQL_PLAYGROUND'),
            introspection: configService.get('GRAPHQL_INTROSPECTION'),
            context: ({ req }) => {
                return {
                    req,
                }
            },
            resolvers: { JSON: GraphQLJSON },
        }
    }
}

export const graphqlModuleConfigAsync: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: async (
        configService: ConfigService,
    ): Promise<GqlModuleOptions> =>
        GraphqlModuleConfig.getGraphqlModuleConfig(configService),
    inject: [ConfigService],
}
