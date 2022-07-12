import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from './user.entity'

@Directive('@extends')
@Directive(
    '@key(fields: "id pinned_comment_id subscribed_users_ids application_id")',
)
@ObjectType()
export class ThreadModel {
    @Directive('@external')
    @Field()
    id: string

    @Directive('@external')
    @Field(() => [String])
    subscribed_users_ids: string[]

    @Directive('@external')
    @Field()
    application_id: string

    @Directive('@external')
    @Field(() => String, { nullable: true })
    pinned_comment_id: string

    @Field((type) => [UserModel])
    subscribed_users: UserModel[]
}
