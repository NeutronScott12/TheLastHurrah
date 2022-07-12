import { Args, Context, Resolver, Subscription, Query } from '@nestjs/graphql'
import { COMMENT_ADDED } from '../constants'
// import { GqlAuthGuard } from '@thelasthurrah/the-last-hurrah-shared'
import { IContext } from '../types'
import { CommentsService } from './services/comments.service'
import { CommentAddedInput } from './dto/comment-added.input'
import { CommentEntity } from './entities/comment.entity'
import { UserService } from './services/user.service'

@Resolver((of) => CommentEntity)
export class CommentsResolver {
    constructor(private readonly commentsService: CommentsService) {}

    @Query((returns) => [CommentEntity])
    fetch_comments() {
        return []
    }

    // @UseGuards(GqlAuthGuard)
    @Subscription((returns) => CommentEntity, {
        filter(payload, variables, context: IContext) {
            return (
                payload.thread_id === variables.thread_id &&
                payload.user_id !== context.user.id
            )
        },
        resolve: async (payload, args, context) => {
            return payload
        },
    })
    comment_added(
        @Args('thread_id') thread_id: string,
        @Context() context: IContext,
    ) {
        // console.log('CONTEXT_RESOLVER', context)
        const response = context.pubSub.asyncIterator(COMMENT_ADDED)
        // console.log('RESPONSE', response)
        return response
    }
}
