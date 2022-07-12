import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
export class ApplicationDto {
    @Field(() => String)
    id: string

    @Field()
    application_name: string

    @Field((type) => Date)
    created_at: Date

    @Field((type) => Date)
    updated_at: Date

    @Field((type) => Date, { nullable: true })
    renewal: Date

    @Field()
    plan: string

    @Field((type) => [String])
    moderators_ids: string[]

    @Field(() => String)
    auth_secret: string

    // @Field((type) => [UserModel])
    // moderators: UserModel[]

    @Field(() => Float)
    cost: number

    @Field((type) => String)
    application_owner_id: string

    @Field((type) => [String], { defaultValue: [] })
    authenticated_users_ids: string[]
}
