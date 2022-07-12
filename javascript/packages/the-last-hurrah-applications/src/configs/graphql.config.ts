import { ConfigModule, ConfigService } from '@nestjs/config'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import { join } from 'path'
import Redis from 'ioredis'

import { CommentModel } from '../application/entities/comment.entity'
import { UserModel } from '../application/entities/user.entity'
import { ThreadModel } from 'src/application/entities/thread.entity'
import {
    ApolloFederationDriver,
    ApolloFederationDriverAsyncConfig,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'
import { configOptions } from './config'

class GraphqlOptions {
    static getGraphqlOptions(
        configService: ConfigService,
    ): ApolloFederationDriverConfig {
        return {
            buildSchemaOptions: {
                orphanedTypes: [UserModel, CommentModel, ThreadModel],
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
            context: ({ req }) => {
                return {
                    req,
                }
            },
        }
    }
}

export const graphqlOptionsAsync: ApolloFederationDriverAsyncConfig = {
    driver: ApolloFederationDriver,
    imports: [ConfigModule.forRoot(configOptions)],
    useFactory: async (configService: ConfigService) =>
        GraphqlOptions.getGraphqlOptions(configService),
    inject: [ConfigService],
}
