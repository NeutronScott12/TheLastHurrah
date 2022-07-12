import { NestFactory } from '@nestjs/core'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { AppModule } from './app.module'

import * as helmet from 'helmet'
import * as compression from 'compression'

import { PORT } from './constants'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const enviroment = process.env.NODE_ENV

    app.connectMicroservice<GrpcOptions>(
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:50056',
                loader: {
                    keepCase: true,
                },
                package: ['comment'],
                protoPath: [
                    join(__dirname, 'comment/proto/comment/comment.proto'),
                ],
            },
        },
        { inheritAppConfig: true },
    )

    // app.use(helmet())
    // console.log(await app.getUrl())
    app.use(compression())
    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Comments')
}
bootstrap()
