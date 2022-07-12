import { NestFactory } from '@nestjs/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { join } from 'path'

import * as compression from 'compression'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.use(compression())

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50055',
                loader: {
                    keepCase: true,
                },
                package: ['thread'],
                protoPath: [
                    join(__dirname, 'thread/proto/thread/thread.proto'),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    await app.startAllMicroservices()
    await app.listen(4007)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Threads')
}
bootstrap()
