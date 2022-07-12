import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    ApolloDriver,
    ApolloDriverAsyncConfig,
    ApolloDriverConfig,
} from '@nestjs/apollo'
import { verifyToken } from '@thelasthurrah/the-last-hurrah-shared'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import { join } from 'path'
import Redis from 'ioredis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { ForbiddenException } from '@nestjs/common'
import {
    INVALID_CREDENTIALS,
    JWT_SECRET,
    REDIS_HOST,
    REDIS_PORT,
} from 'src/constants'
import { configOptions } from './config'

class GraphqlConfig {
    static getGraphqlConfig(configService: ConfigService): ApolloDriverConfig {
        console.log(REDIS_HOST, REDIS_PORT)
        return {
            // installSubscriptionHandlers: true,
            subscriptions: {
                'graphql-ws': true,
            },
            // subscriptions: {
            //     'subscriptions-transport-ws': {
            //         path: '/graphql',
            //         onConnect: (connectionParams) => {
            //             // console.log('CONNECTION_PARAMS', connectionParams)
            //             const redis = new Redis(
            //                 configService.get(REDIS_PORT),
            //                 configService.get(REDIS_HOST),
            //             )
            //             const pubSub: RedisPubSub = new RedisPubSub({
            //                 publisher: redis,
            //                 subscriber: redis,
            //             })

            //             try {
            //                 if (
            //                     connectionParams['Authorization'] &&
            //                     connectionParams['Authorization'].split(' ')[1]
            //                 ) {
            //                     const token: string =
            //                         connectionParams['Authorization'].split(
            //                             ' ',
            //                         )[1]

            //                     const verify = verifyToken(
            //                         token,
            //                         configService.get(JWT_SECRET),
            //                     )

            //                     return { redis, pubSub, user: verify }
            //                 }
            //             } catch (error) {
            //                 console.log('ERROR', error)
            //                 throw new ForbiddenException({
            //                     success: false,
            //                     message: INVALID_CREDENTIALS,
            //                 })
            //             }
            //         },
            //     },
            // },

            // cache: new BaseRedisCache({
            //     client: new Redis({
            //         host: configService.get(REDIS_HOST),
            //         port: configService.get(REDIS_PORT),
            //     }),
            // }),

            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            // debug: configService.get('GRAPHQL_DEBUG'),
            // playground: configService.get('GRAPHQL_PLAYGROUND'),
            // introspection: configService.get('GRAPHQL_INTROSPECTION'),
            // context: (context) => {
            //     const redis = new Redis(
            //         configService.get(REDIS_PORT),
            //         configService.get(REDIS_HOST),
            //     )
            //     const pubSub: RedisPubSub = new RedisPubSub({
            //         publisher: redis,
            //         subscriber: redis,
            //     })
            //     if (context.connection) {
            //         return { req: context.req, pubSub, redis }
            //     }
            //     return {
            //         req: context.req,
            //         pubSub,
            //         redis,
            //     }
            // },
            // definitions: {
            //     path: join(process.cwd(), 'src/graphql.ts'),
            // },
        }
    }
}

export const asyncGraphqlOptions: ApolloDriverAsyncConfig = {
    driver: ApolloDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory(configService: ConfigService) {
        return GraphqlConfig.getGraphqlConfig(configService)
    },
    inject: [ConfigService],
}
