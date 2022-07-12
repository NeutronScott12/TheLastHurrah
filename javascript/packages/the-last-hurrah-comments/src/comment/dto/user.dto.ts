import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserDto {
    @Field((type) => String)
    id: string

    @Field((type) => [String])
    applications_joined_ids: string[]

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field()
    user_role: string

    @Field()
    email: string

    @Field(() => [UserDto])
    blocked_users: UserDto[]

    @Field()
    username: string

    password: string

    @Field(() => Date)
    last_active: Date

    @Field()
    confirmed: boolean
}
