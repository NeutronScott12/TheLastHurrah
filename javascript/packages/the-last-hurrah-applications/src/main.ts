import { NestFactory } from '@nestjs/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { join } from 'path/posix'

import * as compression from 'compression'
import * as helmet from 'helmet'

import { AppModule } from './app.module'
import { PORT } from './constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50051',
                loader: {
                    keepCase: true,
                },
                package: ['application'],
                protoPath: [
                    join(
                        __dirname,
                        'application/proto/application/application.proto',
                    ),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    app.use(compression())

    await app.startAllMicroservices()
    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Application')
}
bootstrap()
