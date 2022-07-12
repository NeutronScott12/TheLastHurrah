import { Controller } from '@nestjs/common'
import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Public } from '@thelasthurrah/the-last-hurrah-shared'
import { COMMENT_GRPC_SERVICE } from 'src/constants'
import { IDeleteCommentsByThreadIdArgs } from '../proto/comment/comment.types'
import { CommentService } from '../services/comment.service'

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Public()
    @GrpcMethod(COMMENT_GRPC_SERVICE, 'deleteCommentsByThreadId')
    async deleteCommentsByThreadId(args: IDeleteCommentsByThreadIdArgs) {
        try {
            await this.commentService.deleteMany(
                {
                    where: {
                        thread_id: args.thread_id,
                    },
                },
                true,
            )

            return {
                success: true,
                message: 'Thread comments deleted',
            }
        } catch (error) {
            throw new RpcException(error)
        }
    }
}
