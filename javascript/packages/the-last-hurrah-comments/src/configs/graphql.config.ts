import {
    ApolloFederationDriver,
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { GraphQLJSON } from 'graphql-type-json'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { ApplicationModel } from 'src/comment/models/application.entity'
import { ThreadModel } from 'src/comment/models/thread.entity'
import { UserModel } from 'src/comment/models/user.model'
import { ProfileEntity } from 'src/comment/models/profile.entity'
import { IContext } from 'src/types'
import { configOptions } from './config'

class GraphqlOptions {
    static getGraphqlOptions(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        return {
            buildSchemaOptions: {
                orphanedTypes: [
                    UserModel,
                    ApplicationModel,
                    ThreadModel,
                    ProfileEntity,
                ],
            },
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
            context: ({ req }): IContext => {
                const redis = new Redis(
                    configService.get('REDIS_PORT'),
                    configService.get('REDIS_HOST'),
                )
                const pubSub: RedisPubSub = new RedisPubSub({
                    publisher: redis,
                    subscriber: redis,
                })

                return {
                    req,
                    pubSub,
                }
            },
            resolvers: { JSON: GraphQLJSON },
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
            },
        }
    }
}

export const GraphqlOptionsAsync: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: async (configService: ConfigService) =>
        GraphqlOptions.getGraphqlOptions(configService),
    inject: [ConfigService],
}
