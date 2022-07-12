import { ConfigModule, ConfigService } from '@nestjs/config'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import { join } from 'path'
import {
    ApolloFederationDriver,
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'

import { OrderEntity } from '../user/entities/order.entity'
import { ApplicationModel } from '../user/entities/application.entity'
import { CommentModel } from '../user/entities/comment.entity'
import { ThreadModel } from '../user/entities/thread.entity'
import { IContext } from 'src/types'
import { configOptions } from '.'

class GraphqlOptions {
    static getGraphqlOptions(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        return {
            buildSchemaOptions: {
                orphanedTypes: [
                    ApplicationModel,
                    CommentModel,
                    ThreadModel,
                    OrderEntity,
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
            // playground: true,
            context: ({ req, res }: IContext) => {
                // console.log(
                //     '_____________________REQ_____________________',
                //     req,
                // )
                // console.log(req)
                return {
                    req,
                    res,
                }
            },
        }
    }
}

export const AsyncGraphqlOptions: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: async (configService: ConfigService) =>
        GraphqlOptions.getGraphqlOptions(configService),
    inject: [ConfigService],
}
