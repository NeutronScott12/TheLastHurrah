import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CommentModel } from '../../models/comment.model'

@ObjectType()
export class FetchAllComments {
    @Field((type) => Int)
    comments_count: number

    @Field((type) => [CommentModel])
    comments: CommentModel[]
}
