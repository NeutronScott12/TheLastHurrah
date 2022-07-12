import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CommentModel } from '../../models/comment.model'

@ObjectType()
export class FetchCommentByThreadIdResponse {
    @Field((type) => Int)
    comments_count: number

    @Field((type) => [CommentModel])
    comments: CommentModel[]
}
