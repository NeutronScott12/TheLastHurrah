import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { join } from 'path'

import Redis from 'ioredis'
import { IContext } from 'src/types'
// import GraphQLJSON from 'graphql-type-json'
import { ThreadModel } from 'src/thread/entities/thread.entity'
import { ApplicationModel } from 'src/thread/entities/application.entity'
import { configOptions } from './config'

class GraphqlConfig {
    static getGraphqlConfig(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        return {
            buildSchemaOptions: {
                orphanedTypes: [ApplicationModel],
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
            introspection: configService.get('GRAPHQL_INTROPECTION'),
            context: ({ req, res }: IContext) => {
                const redis = new Redis(
                    configService.get('REDIS_HOST'),
                    configService.get('REDIS_PORT'),
                )

                const pubSub: RedisPubSub = new RedisPubSub({
                    //@ts-ignore
                    publisher: redis,
                    //@ts-ignore
                    subscriber: redis,
                })

                return {
                    req,
                    res,
                    pubSub,
                }
            },
            // resolvers: { JSON: GraphQLJSON },
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
            },
        }
    }
}

export const asyncGraphqlConfig: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
        GraphqlConfig.getGraphqlConfig(configService),
}
