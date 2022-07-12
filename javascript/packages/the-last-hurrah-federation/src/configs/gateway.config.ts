import { ConfigModule, ConfigService } from '@nestjs/config'
import {
    ApolloGatewayDriver,
    ApolloGatewayDriverAsyncConfig,
    ApolloGatewayDriverConfig,
} from '@nestjs/apollo'

import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'

import { BuildServiceModule } from 'src/auth/BuildServiceModule'
import { IContext } from '../types'
import { GATEWAY_BUILD_SERVICE } from 'src/contants'
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway'

const url =
    process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'host.docker.internal'
// const url = '0.0.0.0'

export class GatewayConfig {
    static getGatewayConfig(
        configService: ConfigService,
    ): ApolloGatewayDriverConfig {
        return {
            gateway: {
                buildService({ name, url }) {
                    return new RemoteGraphQLDataSource({
                        url,
                        willSendRequest({ request, context }) {
                            if (context.hasOwnProperty('jwt')) {
                                //@ts-ignore
                                request.http.headers.set(
                                    'Authorization',
                                    //@ts-ignore
                                    context.jwt,
                                )
                            }

                            if (context.hasOwnProperty('x-real-ip')) {
                                // console.log('CONTEXT', context)
                                request.http.headers.set(
                                    'x-real-ip',
                                    context['x-real-ip'],
                                )
                            }
                        },
                    })
                },
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: [
                        {
                            name: 'authentication',
                            url: `http://${url}:4001/graphql`,
                        },
                        {
                            name: 'comments',
                            url: `http://${url}:4002/graphql`,
                        },
                        {
                            name: 'applications',
                            url: `http://${url}:4004/graphql`,
                        },
                        {
                            name: 'commence',
                            url: `http://${url}:4005/graphql`,
                        },
                        {
                            name: 'notifications',
                            url: `http://${url}:4006/graphql`,
                        },
                        {
                            name: 'threads',
                            url: `http://${url}:4007/graphql`,
                        },
                    ],
                }),
            },

            server: {
                debug: configService.get('GRAPHQL_DEBUG'),
                playground: configService.get('GRAPHQL_PLAYGROUND'),
                introspection: configService.get('GRAPHQL_INTROSPECTION'),
                cache: new BaseRedisCache({
                    client: new Redis({
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    }),
                }),
                context: ({ req }: IContext) => {
                    console.log('IP', req.ip)
                    try {
                        if (req.headers.authorization) {
                            return {
                                jwt: req.headers.authorization,
                                federation_real_ip: req.headers['x-real-ip'],
                            }
                        }

                        return {
                            'x-real-ip': req.headers['x-real-ip'],
                        }
                    } catch (error) {
                        return {}
                    }
                },
            },
        }
    }
}

export const GatewayConfigAsync: ApolloGatewayDriverAsyncConfig = {
    driver: ApolloGatewayDriver,
    imports: [ConfigModule, BuildServiceModule],
    useFactory: async (
        configService: ConfigService,
    ): Promise<ApolloGatewayDriverConfig> =>
        GatewayConfig.getGatewayConfig(configService),
    inject: [ConfigService, GATEWAY_BUILD_SERVICE],
    // inject: [ConfigService],
}
