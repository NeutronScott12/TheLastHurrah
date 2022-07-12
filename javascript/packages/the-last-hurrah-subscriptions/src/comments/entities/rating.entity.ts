import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RatingEntity {
    @Field((type) => String)
    id: string

    @Field((type) => String)
    author_id: string
}
