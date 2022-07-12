import { CacheModule, Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'

import { PrismaService } from '../prisma/prisma.service'
import { ApplicationResolver } from './resolvers/application.resolver'
import { CommentResolver } from './resolvers/comment.resolver'
import { ProfileResolver } from './resolvers/profile.resolver'
import { UserResolver } from './resolvers/user.resolver'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { UserMailService } from './services/user-mail.service'
import { AUTH_EMAIL_QUEUE } from '../constants'
import { AuthEmailProducer } from './producers/auth-email.producer'
import { AuthEmailConsumer } from './comsumers/auth-email.comsumer'
import { cacheConfigAsync } from '../configs/cache.config'
import { ThreadResolver } from './resolvers/thread.resolver'
import { ApplicationService } from './services/application.service'
import { grpClient } from '../configs/grpcClient.config'
import { CommenceResolver } from './resolvers/commence.resolver'
import { AuthenticationController } from './controllers/authentication.controller'

@Module({
    providers: [
        UserResolver,
        CommentResolver,
        ApplicationResolver,
        ApplicationService,
        ProfileResolver,
        ThreadResolver,
        PrismaService,
        UserMailService,
        AuthEmailProducer,
        AuthEmailConsumer,
        UserService,
        CommenceResolver,
    ],
    controllers: [UserController, AuthenticationController],
    imports: [
        ClientsModule.register(grpClient),
        BullModule.registerQueue({ name: AUTH_EMAIL_QUEUE }),
        CacheModule.registerAsync(cacheConfigAsync),
    ],
})
export class UserModule {}
