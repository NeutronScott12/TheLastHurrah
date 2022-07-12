import { Module } from '@nestjs/common'
import { CommentsService } from './services/comments.service'
import { CommentsResolver } from './comments.resolver'
import { GrpcClientOptions } from 'src/configs/grpcClient.config'
import { ClientsModule } from '@nestjs/microservices'
import { UserService } from './services/user.service'

@Module({
    providers: [CommentsResolver, CommentsService, UserService],
    imports: [ClientsModule.register(GrpcClientOptions)],
})
export class CommentsModule {}
