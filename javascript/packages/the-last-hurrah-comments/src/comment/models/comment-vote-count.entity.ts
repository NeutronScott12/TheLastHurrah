import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CommentAndVoteCountEntity {
    @Field(() => Int)
    comment_count: number

    @Field(() => Int)
    vote_count: number
}
