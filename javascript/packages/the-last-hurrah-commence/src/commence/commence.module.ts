import { Module } from '@nestjs/common'
import { CommenceService } from './services/commence.service'
import { CommenceResolver } from './resolvers/commence.resolver'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from '@thelasthurrah/the-last-hurrah-shared'
import { PrismaService } from '../prisma/prisma.service'

@Module({
    providers: [
        { provide: APP_GUARD, useClass: GqlAuthGuard },
        CommenceResolver,
        CommenceService,
        PrismaService,
    ],
})
export class CommenceModule {}
