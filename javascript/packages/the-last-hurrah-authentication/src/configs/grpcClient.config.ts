import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

import { APPLICATION_PACKAGE } from '../constants'

const url =
    process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'host.docker.internal'

export const grpClient: ClientsModuleOptions = [
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
                '../user/proto/application/application.proto',
            ),
        },
    },
]
