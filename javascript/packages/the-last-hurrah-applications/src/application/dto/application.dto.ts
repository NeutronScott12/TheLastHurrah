import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
export class ApplicationDto {
    @Field(() => String)
    id: string

    @Field()
    application_name: string

    @Field()
    short_name: string

    @Field(() => Date)
    created_at: Date

    @Field(() => Date)
    updated_at: Date

    @Field()
    plan: string

    @Field(() => [String])
    moderators_ids: string[]

    @Field(() => String)
    auth_secret: string

    // @Field((type) => [UserModel])
    // moderators: UserModel[]

    @Field(() => Float)
    cost: number

    @Field(() => String)
    application_owner_id: string

    @Field(() => [String], { defaultValue: [] })
    authenticated_users_ids: string[]
}
