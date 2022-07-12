import { NestFactory } from '@nestjs/core'
import { join } from 'path'
import { GrpcOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50056',
                loader: {
                    keepCase: true,
                },
                package: ['thread', 'application'],
                protoPath: [
                    join(__dirname, 'thread/proto/thread.proto'),
                    join(__dirname, 'application/proto/application.proto'),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    await app.listen(5000)
}
bootstrap()
