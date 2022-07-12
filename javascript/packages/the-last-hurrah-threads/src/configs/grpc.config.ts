import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

import {
    APPLICATION_PACKAGE,
    AUTHENTICATION_PACKAGE,
    COMMENT_PACKAGE,
} from '../constants'

const url =
    process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'host.docker.internal'

export const grpClient: ClientsModuleOptions = [
    {
        name: AUTHENTICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50050`,
            package: 'authentication',
            protoPath: join(
                __dirname,
                '../thread/proto/authentication/authentication.proto',
            ),
        },
    },
    {
        name: APPLICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50051`,
            package: 'application',
            protoPath: join(
                __dirname,
                '../thread/proto/application/application.proto',
            ),
        },
    },
    {
        name: COMMENT_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50056`,
            package: 'comment',
            protoPath: join(__dirname, '../thread/proto/comment/comment.proto'),
        },
    },
]
