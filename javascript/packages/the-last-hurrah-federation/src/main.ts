import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as helmet from 'helmet'
import * as csurf from 'csurf'
import * as compression from 'compression'
import * as dotenv from 'dotenv'

import { engine } from 'express-handlebars'
import { AppModule } from './app.module'
import { PORT } from './contants'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'

dotenv.config()

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    // app.connectMicroservice(
    //     {
    //         transport: Transport.GRPC,
    //         options: {
    //             package: '',
    //         },
    //     },
    //     { inheritAppConfig: true },
    // )

    app.use(compression())

    app.useStaticAssets(join(__dirname, '..', 'public'))
    app.setBaseViewsDir(join(__dirname, '..', 'views'))
    app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'index' }))
    app.set('view engine', '.hbs')
    // app.use(helmet())

    // app.use(csurf())

    await app.startAllMicroservices()
    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Gateway Server')
}
bootstrap()
