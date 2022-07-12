import { Module } from '@nestjs/common'

import { RemoteGraphQLDataSource } from '@apollo/gateway'
import { GATEWAY_BUILD_SERVICE } from 'src/contants'
// import { decode } from 'jsonwebtoken'

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    async willSendRequest({ request, context }) {
        if (context.hasOwnProperty('jwt')) {
            //@ts-ignore
            request.http.headers.set('Authorization', context.jwt)
        }

        if (context.hasOwnProperty('x-real-ip')) {
            request.http.headers.set('x-real-ip', context['x-real-ip'])
        }
    }
}

@Module({
    providers: [
        {
            provide: AuthenticatedDataSource,
            useValue: AuthenticatedDataSource,
        },
        {
            provide: GATEWAY_BUILD_SERVICE,
            useFactory: (AuthenticatedDataSource) => {
                return ({ name, url }) => new AuthenticatedDataSource({ url })
            },
            inject: [AuthenticatedDataSource],
        },
    ],
    exports: [GATEWAY_BUILD_SERVICE],
})
export class BuildServiceModule {}
