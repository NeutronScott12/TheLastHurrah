import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import {
    APPLICATION_PACKAGE,
    AUTHENTICATION_PACKAGE,
    NOTIFICATION_PACKAGE,
    THREAD_PACKAGE,
} from 'src/constants'

const url =
    process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'host.docker.internal'

export const GrpcClientOptions: ClientsModuleOptions = [
    {
        name: AUTHENTICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50050`,
            package: 'authentication',
            protoPath: join(__dirname, '../comment/proto/user/user.proto'),
        },
    },
    {
        name: NOTIFICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: `${url}:50054`,
            package: 'notification',
            protoPath: join(
                __dirname,
                '../comment/proto/notification/notification.proto',
            ),
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
            protoPath: join(__dirname, '../comment/proto/thread/thread.proto'),
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
            protoPath: join(__dirname, '../comment/proto/application.proto'),
        },
    },
]
