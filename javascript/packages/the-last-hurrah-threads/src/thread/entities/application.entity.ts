import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { ThreadModel } from './thread.entity'

@ObjectType()
@Directive('@extends')
@Directive(
    // '@key(fields: "id")',
    '@key(fields: "id thread_ids moderators_ids authenticated_users_ids banned_users_by_id")',
)
export class ApplicationModel {
    @Field(() => String)
    @Directive('@external')
    id: string

    @Directive('@requires(fields: "moderators_ids")')
    @Directive('@requires(fields: "id")')
    @Field((type) => [String])
    @Directive('@external')
    moderators_ids: string[]

    @Field((type) => [String])
    @Directive('@external')
    authenticated_users_ids: string[]

    @Field((type) => [String])
    @Directive('@external')
    thread_ids: string[]

    @Field((type) => [String])
    @Directive('@external')
    banned_users_by_id: string[]

    @Field(() => [ThreadModel])
    threads: ThreadModel[]
}
