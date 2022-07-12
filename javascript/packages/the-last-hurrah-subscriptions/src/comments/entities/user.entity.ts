import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserEntity {
    @Field((type) => String)
    id: string

    @Field((type) => String)
    username: string
}
