import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CountModel {
    @Field((type) => Int)
    up_vote: number

    @Field((type) => Int)
    down_vote: number

    @Field((type) => Int)
    replies: number
}
