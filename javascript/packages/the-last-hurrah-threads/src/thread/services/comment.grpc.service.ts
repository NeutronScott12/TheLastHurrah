import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { COMMENT_GRPC_SERVICE, COMMENT_PACKAGE } from '../../constants'
import {
    CommentService,
    IDeleteCommentsByThreadIdArgs,
} from '../proto/comment/comment.types'

@Injectable()
export class CommentGrpcService {
    commentService: CommentService

    constructor(@Inject(COMMENT_PACKAGE) private grpcClient: ClientGrpc) {}

    onModuleInit() {
        this.commentService =
            this.grpcClient.getService<CommentService>(COMMENT_GRPC_SERVICE)
    }

    async deleteCommentsByThreadId(args: IDeleteCommentsByThreadIdArgs) {
        try {
            const result = this.commentService.deleteCommentsByThreadId(args)
            return lastValueFrom(result)
        } catch (error) {
            throw new InternalServerErrorException({
                success: false,
                message: error.message,
            })
        }
    }
}
