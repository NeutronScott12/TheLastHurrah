import { Module } from '@nestjs/common'
import { GqlAuthGuard } from '@thelasthurrah/the-last-hurrah-shared'
import { ClientsModule } from '@nestjs/microservices'
import { BullModule } from '@nestjs/bull'

import { CommentResolver } from './resolvers/comment.resolver'
import { CommentService } from './services/comment.service'
import { ApplicationResolver } from './resolvers/application.resolvers'
import { PrismaService } from 'src/prisma/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { ThreadResolver } from './resolvers/thread.resolves'
import { ApplicationService } from './services/application.service'
// import { CaslAbilityFactory } from 'src/auth/casl/casl.ability.factory'
import { RatingResolvers } from './resolvers/rating.resolves'
import { RatingService } from './services/rating.service'
import { UserService } from './services/user.service'
import { ReportResolver } from './resolvers/report.resolvers'
import { ModerationResolver } from './resolvers/moderation.resolvers'
import { CommentConsumer } from './consumers/comment.consumer'
import { NotificationService } from './services/notification.service'
import { ThreadService } from './services/thread.service'
import { GrpcClientOptions } from 'src/configs/GrpcClient.config'
import { ProfileResolver } from './resolvers/profile.resolver'
import { CommentQueueProducer } from './producer/coomment.producer'
import { CommentEmailService } from './services/email.service'
import { APPLICATION_QUEUE, COMMENT_QUEUE } from 'src/constants'
import { CommentStatsResolver } from './resolvers/comment-stats.resolver'
import { CommentController } from './controllers/comment.controller'

@Module({
    providers: [
        { provide: APP_GUARD, useClass: GqlAuthGuard },
        CommentResolver,
        ApplicationResolver,
        RatingResolvers,
        ReportResolver,
        ThreadResolver,
        ModerationResolver,
        CommentService,
        ApplicationService,
        RatingService,
        PrismaService,
        UserService,
        ThreadService,
        NotificationService,
        ProfileResolver,
        CommentConsumer,
        CommentQueueProducer,
        // CaslAbilityFactory,
        CommentEmailService,
        CommentStatsResolver,
    ],
    controllers: [CommentController],
    imports: [
        BullModule.registerQueue({ name: COMMENT_QUEUE }),
        BullModule.registerQueue({ name: APPLICATION_QUEUE }),
        ClientsModule.register(GrpcClientOptions),
    ],
})
export class CommentModule {}
