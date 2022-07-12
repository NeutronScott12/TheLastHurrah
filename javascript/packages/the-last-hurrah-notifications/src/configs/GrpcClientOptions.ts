import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { APPLICATION_PACKAGE } from '../constants'

const url =
    process.env.NODE_ENV === 'development' || 'test'
        ? '0.0.0.0'
        : 'host.docker.internal'

export const GrpcClientOptions: ClientsModuleOptions = [
    {
        name: APPLICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            url: `${url}:50051`,
            package: 'application',
            protoPath: join(
                __dirname,
                '../notifications/proto/application.proto',
            ),
        },
    },
]
