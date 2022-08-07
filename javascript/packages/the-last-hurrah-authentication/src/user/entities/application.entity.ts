import { ObjectType, Field, Directive } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@ObjectType()
@Directive(
    '@key(fields: "id thread_ids moderators_ids authenticated_users_ids banned_users_by_id")',
)
export class ApplicationModel {
    @Field(() => String)
    id: string

    // @Directive('@requires(fields: "moderators_ids")')
    // @Directive('@requires(fields: "id")')
    @Field((type) => [String])
    moderators_ids: string[]

    @Field((type) => [String])
    authenticated_users_ids: string[]

    @Field((type) => [String])
    thread_ids: string[]

    @Field((type) => [String])
    banned_users_by_id: string[]

    @Field((type) => [UserModel])
    authenticated_users: UserModel[]

    @Field((type) => [UserModel], { defaultValue: [] })
    moderators: UserModel[]
}
