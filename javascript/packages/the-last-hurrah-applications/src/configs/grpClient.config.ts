import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

import {
    AUTHENTICATION_PACKAGE,
    COMMENCE_PACKAGE,
    THREAD_PACKAGE,
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
            protoPath: join(__dirname, '../proto/user/user.proto'),
        },
    },
    {
        name: THREAD_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50055`,
            package: 'thread',
            protoPath: join(
                __dirname,
                '../application/proto/thread/thread.proto',
            ),
        },
    },
    {
        name: COMMENCE_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50052`,
            package: 'commence',
            protoPath: join(
                __dirname,
                '../application/proto/commence/commence.proto',
            ),
        },
    },
]
