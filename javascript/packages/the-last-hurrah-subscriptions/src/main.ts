import { NestFactory } from '@nestjs/core'
import { startUpMessages } from '@thelasthurrah/the-last-hurrah-shared'
import { AppModule } from './app.module'
import { PORT } from './constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    await app.listen(PORT)
    startUpMessages(`${await app.getUrl()}/graphql`, 'Subscriptions')
}
bootstrap()
