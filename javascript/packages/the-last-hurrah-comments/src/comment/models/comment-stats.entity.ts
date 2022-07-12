import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CommentsPerDay {
    @Field(() => Int)
    count: number

    @Field(() => Date)
    date: Date
}

@ObjectType()
export class CommentStatsEntity {
    @Field(() => [CommentsPerDay])
    comments_per_day: CommentsPerDay[]
}
