import { ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { AUTHENTICATION_PACKAGE } from 'src/constants'

export const GrpcClientOptions: ClientsModuleOptions = [
    {
        name: AUTHENTICATION_PACKAGE,
        transport: Transport.GRPC,
        options: {
            loader: {
                keepCase: true,
            },
            url: '0.0.0.0:50050',
            package: 'authentication',
            protoPath: join(__dirname, '../comments/proto/user/user.proto'),
        },
    },
]
