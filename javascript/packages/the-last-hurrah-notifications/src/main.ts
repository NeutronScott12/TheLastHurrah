import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50054',
                loader: {
                    keepCase: true,
                },
                package: ['notification', 'grpc.health.v1'],
                protoPath: [
                    join(__dirname, 'notifications/proto/notification.proto'),
                    join(__dirname, 'notifications/proto/health.proto'),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    await app.startAllMicroservices()
    await app.listen(4006)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Notifications')
}
bootstrap()
