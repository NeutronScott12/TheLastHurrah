import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ViewEntity {
    @Field()
    id: string

    @Field()
    user_id: string

    @Field(() => Int)
    view_count: number

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date
}
