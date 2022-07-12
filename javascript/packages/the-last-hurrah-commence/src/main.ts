import { NestFactory } from '@nestjs/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { join } from 'path'

import { AppModule } from './app.module'

import { PORT } from './constants'

//@ts-ignore
BigInt.prototype.toJSON = function () {
    return Number(this)
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50052',
                loader: {
                    keepCase: true,
                },
                package: ['commence'],
                protoPath: [
                    join(__dirname, 'commence/proto/commence/commence.proto'),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    await app.startAllMicroservices()
    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Commence')
}
bootstrap()
