import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Transport, GrpcOptions } from '@nestjs/microservices'
import { join } from 'path'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import * as helmet from 'helmet'

import { AppModule } from './app.module'
import { PORT } from './constants'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    // app.use(
    //     helmet({
    //         contentSecurityPolicy:
    //             process.env.NODE_ENV === 'production' ? undefined : false,
    //     }),
    // )

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50050',
                loader: {
                    keepCase: true,
                },
                package: 'authentication',
                protoPath: join(__dirname, 'user/proto/user/user.proto'),
            },
        },
        { inheritAppConfig: true },
    )

    await app.startAllMicroservices()
    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Authentication')
}
bootstrap()
